function toSlug(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

module.exports = toSlug;
