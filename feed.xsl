<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/"
  exclude-result-prefixes="atom media">
  <xsl:output method="html" encoding="utf-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title><xsl:value-of select="/atom:feed/atom:title" /></title>
        <style>
          :root {
            color-scheme: light dark;
            --bg: #f7f4ee;
            --panel: #ffffff;
            --text: #171717;
            --muted: #5f6368;
            --line: #ded8ce;
            --accent: #256d47;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #101114;
              --panel: #181a1f;
              --text: #f3f4f6;
              --muted: #b4bac4;
              --line: #2d3138;
              --accent: #7bd88f;
            }
          }

          body {
            margin: 0;
            background: var(--bg);
            color: var(--text);
            font-family: Atkinson Hyperlegible, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            line-height: 1.6;
          }

          main {
            width: min(100% - 2rem, 880px);
            margin: 0 auto;
            padding: 3rem 0;
          }

          header {
            border-bottom: 1px solid var(--line);
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
          }

          h1 {
            margin: 0;
            font-size: clamp(2rem, 5vw, 3.25rem);
            line-height: 1.05;
          }

          .subtitle,
          .meta,
          .note {
            color: var(--muted);
          }

          .note {
            margin-top: 1rem;
          }

          article {
            background: var(--panel);
            border: 1px solid var(--line);
            border-radius: 8px;
            margin: 1.25rem 0;
            padding: 1.25rem;
          }

          article h2 {
            margin: 0 0 0.35rem;
            font-size: clamp(1.25rem, 3vw, 1.75rem);
            line-height: 1.2;
          }

          article h2 a {
            color: var(--text);
            text-decoration-color: var(--accent);
            text-underline-offset: 0.2em;
          }

          .summary {
            margin-top: 0.85rem;
          }

          .thumb {
            display: block;
            width: min(100%, 680px);
            height: auto;
            border-radius: 8px;
            margin: 1rem 0;
          }

          .summary img {
            display: block;
            width: min(100%, 680px);
            height: auto;
            border-radius: 8px;
            margin: 0 0 1rem;
          }

          .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-top: 1rem;
          }

          .actions a {
            color: var(--accent);
            font-weight: 700;
          }
        </style>
      </head>
      <body>
        <main>
          <header>
            <h1><xsl:value-of select="/atom:feed/atom:title" /></h1>
            <p class="subtitle"><xsl:value-of select="/atom:feed/atom:subtitle" /></p>
            <p class="note">This is an Atom feed. Subscribe with your feed reader, or browse recent entries below.</p>
          </header>

          <xsl:for-each select="/atom:feed/atom:entry">
            <article>
              <h2>
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="atom:link/@href" /></xsl:attribute>
                  <xsl:value-of select="atom:title" />
                </a>
              </h2>
              <div class="meta">
                <xsl:value-of select="substring(atom:updated, 1, 10)" />
              </div>
              <xsl:if test="media:thumbnail/@url">
                <img class="thumb">
                  <xsl:attribute name="src"><xsl:value-of select="media:thumbnail/@url" /></xsl:attribute>
                  <xsl:attribute name="alt"><xsl:value-of select="atom:title" /></xsl:attribute>
                </img>
              </xsl:if>
              <div class="summary">
                <xsl:choose>
                  <xsl:when test="atom:summary">
                    <xsl:value-of select="atom:summary" disable-output-escaping="yes" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="atom:content" disable-output-escaping="yes" />
                  </xsl:otherwise>
                </xsl:choose>
              </div>
              <div class="actions">
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="atom:link/@href" /></xsl:attribute>
                  Read on kylereddoch.me
                </a>
              </div>
            </article>
          </xsl:for-each>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
