---
date: 2026-02-03T11:15:00-05:00
title: "Digital Forensics for a Compromised Container: What to Collect and How to Snapshot It"
description: "A practical, incident-response-first checklist for container forensics across Docker and Kubernetes, including the logs and artifacts that actually matter and the safest ways to preserve them."
tags: [cybersecurity, incident-response, digital-forensics, docker, kubernetes, devsecops]
mastodon_url: null
---

A buddy in infosec recently asked a question that hits the painful truth about containers: they feel disposable right up until you need evidence.

> “What logs need to be collected and what’s the best way to snapshot for further digging?”

The trick is thinking in **layers**. A container is rarely “the whole crime scene.” Most of the evidence lives in one of four places:

1) **The container (process + filesystem)**  
2) **The node/host (runtime, kernel, auth, networking)**  
3) **The orchestrator (Kubernetes control plane, audit, events)**  
4) **Your cloud and edge (load balancers, WAF, IAM, flow logs)**  

Below is a field-tested approach that prioritizes **preservation first**, then analysis.

## Guiding principles for container forensics

### Preserve first, analyze second

In incident response, “just one quick command” turns into “why is the timestamp different now?” Real forensics means you preserve what you can with minimal changes, and you log every action you take. NIST frames incident response as a risk management activity where documentation and repeatability matter for both recovery and learning in [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final).

### Containers lie by omission

Containers typically do not contain the logs you want. Many logs are on the host or shipped to a logging backend. Kubernetes and Docker logging designs make this explicit in the [Kubernetes logging architecture](https://kubernetes.io/docs/concepts/cluster-administration/logging/) and the [Docker json-file logging driver](https://docs.docker.com/engine/logging/drivers/json-file/).

### Assume attacker goals include escaping the container

If the attacker got root in a container, the next move is often: steal secrets, pivot laterally, or attempt host escape. MITRE tracks “Escape to Host” as a specific technique in [ATT&CK T1611](https://attack.mitre.org/techniques/T1611/), which is a nice reminder to collect host evidence even when the “problem” looks container-scoped.

## The “clock is ticking” triage order

If you only have 10 minutes before someone deletes the pod, the node autoscaling replaces it, or the attacker wipes tracks:

1) Record **time**, **cluster/node**, **namespace**, **pod**, **container ID**, **image digest**, and **node name**
2) Pull **Kubernetes events** and object specs (pod/deploy/rs)
3) Pull **container stdout/stderr logs** (including previous instance)
4) Pull **Kubernetes API audit logs** (or managed control plane logs)
5) Snapshot **persistent volumes** attached to the workload
6) Preserve **node logs** (kubelet, runtime, auth, kernel, audit)
7) Preserve **network telemetry** (ingress/load balancer/WAF, flow logs)
8) Preserve **registry evidence** (image, tags, SBOM if you have it)
9) Hash everything you export
10) Start analysis on copies, not originals

Kubernetes even calls out `--previous` for grabbing logs from a prior crashed container instance in the [kubectl logs reference](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_logs/).

Kubernetes documents where system and container logs end up (journald vs `/var/log`, and pod logs under `/var/log/pods`) in the [Kubernetes system logs](https://kubernetes.io/docs/concepts/cluster-administration/system-logs/) and [logging architecture](https://kubernetes.io/docs/concepts/cluster-administration/logging/) docs.

### Evidence capture checklist (copy/paste runbook)

> Goal: collect **high-value, high-volatility** artifacts first, store them in a case folder, hash everything, then investigate from copies. Avoid dumping secrets unless you have explicit approval and a safe handling plan.

##### 0) Create a case folder and record identifiers

- [ ] Create case folder
- [ ] Record: time window, cluster, namespace, pod, node, container IDs, image digest, PV names, service account

```bash
CASE="case-INC123-2026-02-02"
mkdir -p "$CASE"/{notes,k8s,logs,node,runtime,storage,network,hashes}
date -u +"%Y-%m-%dT%H:%M:%SZ" | tee "$CASE/notes/collected_at_utc.txt"
```

#### Kubernetes (workload + logs + events)

##### 1) Capture pod spec, describe output, and related objects

- [ ] Pod YAML (source of truth for what ran)
- [ ] Describe (why it restarted, probe failures, node, image pull, etc.)
- [ ] Deployment/ReplicaSet YAML (how it was supposed to run)

```bash
NS="<namespace>"
POD="<pod-name>"

kubectl get pod "$POD" -n "$NS" -o yaml > "$CASE/k8s/pod.yaml"
kubectl describe pod "$POD" -n "$NS" > "$CASE/k8s/pod.describe.txt"

# Optional: grab owning controller (deployment/rs) if known
DEPLOY="<deployment-name>"
kubectl get deploy "$DEPLOY" -n "$NS" -o yaml > "$CASE/k8s/deploy.yaml" 2>/dev/null || true

kubectl get rs -n "$NS" -o yaml > "$CASE/k8s/replicasets.yaml"
kubectl get svc -n "$NS" -o yaml > "$CASE/k8s/services.yaml"
kubectl get cm -n "$NS" -o yaml > "$CASE/k8s/configmaps.yaml"
kubectl get sa -n "$NS" -o yaml > "$CASE/k8s/serviceaccounts.yaml"
```

> Note: be careful exporting Secrets. If you must, document approval and store them encrypted.

##### 2) Capture events (often the fastest breadcrumb trail)

- [ ] Namespace events sorted by time

```bash
kubectl get events -n "$NS" --sort-by=.lastTimestamp > "$CASE/k8s/events.txt"
```

##### 3) Capture container logs (including previous instance)

- [ ] Current logs, all containers, timestamps
- [ ] Previous logs if the container restarted

```bash
kubectl logs "$POD" -n "$NS" --all-containers --timestamps > "$CASE/logs/pod.logs.txt"

# If restartCount > 0 for any container, grab previous logs too
kubectl logs "$POD" -n "$NS" --all-containers --previous --timestamps > "$CASE/logs/pod.logs.previous.txt" 2>/dev/null || true
```

##### 4) Capture what the cluster thinks is running (quick inventory)

- [ ] Wide output (node, IPs)
- [ ] Container image digests

```bash
kubectl get pod "$POD" -n "$NS" -o wide > "$CASE/k8s/pod.wide.txt"
kubectl get pod "$POD" -n "$NS" -o jsonpath='{range .status.containerStatuses[*]}{.name}{" "}{.image}{" "}{.imageID}{"
"}{end}'   > "$CASE/k8s/container.imageids.txt"
```

#### Kubernetes control plane (audit and authz evidence)

##### 5) Audit logs (if enabled / available)

- [ ] Export Kubernetes API audit logs from your control plane logging destination
- [ ] Export identity logs for the same time window (cloud IAM / SSO / IdP)

> This step is environment-specific, so the “command” is usually: export from your logging platform/SIEM using a time window and filters for the namespace, resource name, and suspicious identities.

Store exports here:

- [ ] `"$CASE/k8s/audit/"`  
- [ ] `"$CASE/network/identity/"`

#### Storage (persistent volumes)

##### 6) Identify PV/PVC attached to the pod

- [ ] Pod volume mapping
- [ ] PVC and PV YAML

```bash
kubectl get pod "$POD" -n "$NS" -o jsonpath='{.spec.volumes[*].name}{"
"}' > "$CASE/storage/pod.volumes.txt"
kubectl get pvc -n "$NS" -o yaml > "$CASE/storage/pvcs.yaml"
kubectl get pv -o yaml > "$CASE/storage/pvs.yaml"
```

##### 7) Snapshot PV data (CSI VolumeSnapshot workflow)

- [ ] Create a `VolumeSnapshot` for each relevant PVC
- [ ] Restore into a new PVC and mount it read-only in a dedicated investigation workload

Example `VolumeSnapshot` (edit placeholders):

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: <pvc-name>-snap-20260202
  namespace: <namespace>
spec:
  volumeSnapshotClassName: <your-snapshot-class>
  source:
    persistentVolumeClaimName: <pvc-name>
```

Save the YAML you applied:

- [ ] `"$CASE/storage/volumesnapshots.yaml"`
- [ ] `"$CASE/storage/snapshot-ids.txt"` (whatever IDs your storage backend returns)

#### Node + runtime (where escapes and tampering show up)

##### 8) Capture node name and then collect node logs

- [ ] Node name from pod
- [ ] journald/system logs, auth logs, audit logs, kubelet logs, runtime logs

```bash
NODE="$(kubectl get pod "$POD" -n "$NS" -o jsonpath='{.spec.nodeName}')"
echo "$NODE" | tee "$CASE/node/node.txt"
```

On the node (or via your node access method), collect logs into an archive:

```bash
# Run on the node if you have access
sudo mkdir -p /tmp/ir-collect
sudo journalctl --since "2026-02-01" --until "2026-02-03" > /tmp/ir-collect/journal.txt

# Common log locations (adjust for your distro)
sudo tar -czf /tmp/ir-collect/var-log.tgz /var/log 2>/dev/null || true

# Copy off the node to your case folder by your preferred secure method (scp, s3, artifact store)
```

##### 9) Runtime metadata (containerd/CRI-O via crictl)

- [ ] Running containers list
- [ ] Inspect the suspicious container
- [ ] Pod sandbox info if needed

```bash
# Run on the node
sudo crictl ps -a > /tmp/ir-collect/crictl-ps.txt
sudo crictl pods -a > /tmp/ir-collect/crictl-pods.txt

CID="<container-id>"
sudo crictl inspect "$CID" > /tmp/ir-collect/crictl-inspect.json
```

Copy `/tmp/ir-collect/*` into:

- [ ] `"$CASE/runtime/"` and `"$CASE/node/"`

#### Docker-only (if this was a Docker host, not Kubernetes)

##### 10) Capture Docker evidence (container + image + filesystem)

- [ ] `docker inspect` (metadata)
- [ ] `docker logs` with timestamps
- [ ] `docker export` (filesystem state)
- [ ] `docker image save` (original image artifact)

```bash
CID="<container-id>"
IMG="<image:tag-or-digest>"

docker inspect "$CID" > "$CASE/runtime/docker.inspect.json"
docker logs --timestamps "$CID" > "$CASE/logs/docker.container.log"

docker container export "$CID" -o "$CASE/runtime/container_fs.tar"
docker image save "$IMG" -o "$CASE/runtime/image.tar"
```

##### 11) Read-only browse of the captured filesystem (on analysis workstation)

- [ ] Extract the exported filesystem copy
- [ ] Bind-mount the extracted directory read-only

```bash
mkdir -p "$CASE/runtime/containerfs" "$CASE/runtime/roview"
tar -xf "$CASE/runtime/container_fs.tar" -C "$CASE/runtime/containerfs"

sudo mount --bind "$CASE/runtime/containerfs" "$CASE/runtime/roview"
sudo mount -o remount,ro,bind "$CASE/runtime/roview"
```

#### Network and edge telemetry (confirm exfil, C2, lateral movement)

##### 12) Export edge logs for the time window

- [ ] Ingress controller logs
- [ ] Load balancer / WAF logs
- [ ] Flow logs (VPC/VNet)
- [ ] DNS logs (internal and external resolver)

Save exports into:

- [ ] `"$CASE/network/"`

#### Hash everything you collected

##### 13) Generate hashes for integrity and chain-of-custody

```bash
find "$CASE" -type f -print0 | sort -z | xargs -0 sha256sum > "$CASE/hashes/SHA256SUMS.txt"
```

## What logs should you collect?

### 1) Kubernetes logs that are almost always worth it

- **Pod logs**: `kubectl logs …` and `--previous` when restarts happened ([kubectl logs](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_logs/))  
- **Events**: scheduling changes, OOMKills, image pulls, probes failing  
- **Audit logs**: this is the big one for “who changed what.” Kubernetes provides native audit logging design and configuration in the [Kubernetes audit docs](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/).

If you run managed Kubernetes, also grab the provider’s control plane logs. For example, Amazon EKS can export audit and control plane components directly to CloudWatch as documented in [EKS control plane logs](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html).

### 2) Node logs you should not ignore

- kubelet logs
- container runtime logs (containerd, CRI-O, or Docker depending on the cluster)
- auth logs (SSH, sudo), audit logs (auditd), kernel logs

Kubernetes explicitly notes kubelet/runtime logging via journald on systemd hosts, otherwise `.log` files in `/var/log` in the [Kubernetes system logs](https://kubernetes.io/docs/concepts/cluster-administration/system-logs/) documentation.

### 3) Docker specific (if you are investigating a Docker host)

If the host uses Docker with the default `json-file` driver, container stdout/stderr are written as JSON log files on the host as described in the [Docker json-file driver](https://docs.docker.com/engine/logging/drivers/json-file/).

Also capture:

- `docker events` output around the time window
- `docker inspect` for the container and image metadata ([docker inspect](https://docs.docker.com/reference/cli/docker/inspect/))

## Snapshotting: the safest ways to preserve evidence

There is no single “snapshot the container” button that preserves everything without side effects. The best snapshot method depends on what you need to preserve.

### Snapshot goal A: Preserve the container filesystem state

**Docker:** export the container filesystem as a tar archive. Docker supports this directly via [docker container export](https://docs.docker.com/reference/cli/docker/container/export/).

```bash
# Metadata first
docker inspect <container_id> > inspect.json
docker logs --timestamps <container_id> > container.log

# Export filesystem state (no history/metadata like a full image)
docker container export <container_id> -o container_fs.tar
sha256sum container_fs.tar inspect.json container.log > SHA256SUMS.txt
```

Notes:

- `docker export` captures the filesystem as it exists. It does not preserve full image layer history.
- If you also need the original image exactly as deployed, export the image too:

```bash
docker image save <image:tag> -o image.tar
sha256sum image.tar >> SHA256SUMS.txt
```

([docker image save](https://docs.docker.com/reference/cli/docker/image/save/))

#### Read-only browsing tip: mount the captured filesystem on a separate box

Operations teams often want to “mount the container filesystem read-only” so they can browse it like a disk image. The safest way to do that is to mount a **copy** read-only, not the live container.

If you used `docker container export`, you can browse the extracted copy on your analysis workstation and enforce a read-only view with a bind mount:

```bash
# On the analysis workstation
mkdir -p /cases/case123/containerfs
tar -xf container_fs.tar -C /cases/case123/containerfs

mkdir -p /cases/case123/roview
mount --bind /cases/case123/containerfs /cases/case123/roview
mount -o remount,ro,bind /cases/case123/roview
```

This approach keeps the original evidence artifact intact, keeps the browsing environment controlled, and reduces the chance you accidentally change timestamps or delete something while poking around.

For Kubernetes clusters using containerd or CRI-O, there usually is not a clean “export root filesystem” button at the API layer, because the container root filesystem is managed as runtime snapshots on the node. In those cases, a practical preservation-first approach is to snapshot the **node disk/VM** and perform offline inspection, or use runtime tooling like `crictl` for inspection in a controlled manner (see the [Kubernetes crictl task](https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/)).

**Kubernetes:** you usually do not “export a container filesystem” cleanly from the API. If you can `kubectl exec` safely, you can copy key paths out (config, app dirs, temp dirs) but be honest: this is invasive and incomplete. When you need a real artifact, your better bet is snapshotting the **node disk** (VM snapshot or volume snapshot) so you preserve runtime and overlay filesystem state.

### Snapshot goal B: Preserve the data the container touched (persistent volumes)

If the workload uses PersistentVolumes, snapshot the volumes at the storage layer.

Kubernetes supports CSI-based VolumeSnapshots via `VolumeSnapshot` and `VolumeSnapshotContent` as documented in [Kubernetes volume snapshots](https://kubernetes.io/docs/concepts/storage/volume-snapshots/).

This is often the single most valuable evidence source because attackers love to:

- modify app content
- drop web shells into mounted volumes
- tamper with databases
- stage exfil data

If your goal is a read-only browse experience for the ops team, restoring the snapshot to a separate PVC and mounting it as `readOnly: true` in a dedicated investigation workload is usually the cleanest workflow. The important part is that you browse a copy, not the original PV.

### Snapshot goal C: Preserve “who did what” in the cluster

This is where audit logs shine. Kubernetes audit logging is built for reconstructing API activity, and managed services can export those logs for you ([Kubernetes audit](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/), [EKS control plane logs](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)).

For self-managed clusters, also consider preserving etcd state. Kubernetes documents built-in etcd snapshots with `etcdctl snapshot save` in the [Kubernetes etcd snapshot docs](https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/).

### Snapshot goal D: Preserve runtime evidence on the node

If you suspect credential theft, container escape attempts, or host tampering, the node is the crime scene.

- Collect system logs as-is (journald exports or `/var/log` archives)
- Capture runtime metadata with `crictl` if the node uses CRI runtimes
- Snapshot the node VM/disk where possible (cloud snapshot, hypervisor snapshot, or storage snapshot)

Kubernetes maintains guidance for using `crictl` to inspect and debug container runtimes on a node in the [Kubernetes crictl task](https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/).

## A practical “evidence bundle” layout

This is how I like to package a case so future-me does not hate present-me:

```txt
case-<ticket>-<date>/
  notes/
    timeline.md
    actions-taken.md
  k8s/
    namespace.txt
    pod.yaml
    deploy.yaml
    events.txt
    describe.txt
    container-logs.txt
    audit/...
  node/
    journald-export.txt
    var-log.tgz
    runtime/
      crictl-ps.txt
      crictl-inspect.json
  storage/
    volumesnapshot.yaml
    snapshot-ids.txt
  hashes/
    SHA256SUMS.txt
```

Chain-of-custody does not need to be dramatic, but it does need to exist. CISA’s guidance on building forensics plans emphasizes having a repeatable process for collecting and handling incident data in [CISA Forensics Recommended Practice](https://www.cisa.gov/sites/default/files/recommended_practices/Forensics_RP.pdf).

## A few blunt lessons from the trenches

- If you do not already have audit logs enabled, your “forensics” becomes archaeology. Fix that before the next incident.  
- If the workload uses **ephemeral storage only**, you may lose evidence when the pod dies. Volume snapshots and centralized logging are your safety net.  
- “Just attach a debug container” is great for troubleshooting, but it can also alter the environment. Kubernetes describes ephemeral containers as a troubleshooting tool in the [Kubernetes ephemeral containers](https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/) documentation, which is exactly why you should treat them as a last resort for evidence preservation.

## The short answer to your friend’s question

**What logs should be collected?**  
Container stdout/stderr, Kubernetes events, Kubernetes audit logs, node kubelet/runtime logs, and edge/cloud logs around ingress and identity. Use audit logs to anchor your timeline and prove who changed what (see [Kubernetes audit](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/) and the [Kubernetes logging architecture](https://kubernetes.io/docs/concepts/cluster-administration/logging/)).

**Best way to snapshot for digging?**  
Snapshot **persistent volumes** (CSI VolumeSnapshots) and snapshot the **node disk/VM** when you need runtime and overlay filesystem evidence. If it’s Docker, use [docker container export](https://docs.docker.com/reference/cli/docker/container/export/) and [docker image save](https://docs.docker.com/reference/cli/docker/image/save/) to preserve filesystem state and image artifacts.

If you keep doing container IR, it’s worth turning this into a runbook and automating the “collect and bundle” part. The universe is chaotic, but your evidence collection does not have to be.
