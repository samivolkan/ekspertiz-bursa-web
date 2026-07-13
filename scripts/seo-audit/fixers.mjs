export function fixExternalLinkRel(source) {
  let changed = 0;
  const output = source.replace(/<a\b[^>]*\btarget=["']_blank["'][^>]*>/gi, (tag) => {
    const relMatch = tag.match(/\brel=(["'])([^"']*)\1/i);
    if (!relMatch) {
      changed += 1;
      return tag.replace(/>$/, ' rel="noopener noreferrer">');
    }
    const values = new Set(relMatch[2].split(/\s+/).filter(Boolean).map((value) => value.toLowerCase()));
    const before = values.size;
    values.add("noopener");
    values.add("noreferrer");
    if (values.size === before) return tag;
    changed += 1;
    return tag.replace(relMatch[0], `rel=${relMatch[1]}${[...values].join(" ")}${relMatch[1]}`);
  });
  return { output, changed };
}

export function assertSafeBranch(branch, dryRun = false) {
  if (!dryRun && ["main", "master", "production"].includes(branch)) {
    throw new Error(`Auto-fix refuses to write directly to protected branch: ${branch}`);
  }
}
