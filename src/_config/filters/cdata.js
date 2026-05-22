export const cdata = value => String(value ?? '').replaceAll(']]>', ']]]]><![CDATA[>');
