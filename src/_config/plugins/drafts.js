export const drafts = eleventyConfig => {
  const shouldExclude = data => {
    if (data.draft) {
      return !process.env.BUILD_DRAFTS;
    }

    if (process.env.BUILD_FUTURE) {
      return false;
    }

    const publishDate = new Date(data.date ?? data.page?.date);
    return !Number.isNaN(publishDate.getTime()) && publishDate > new Date();
  };

  eleventyConfig.addGlobalData('eleventyComputed.permalink', function () {
    return data => {
      if (shouldExclude(data)) {
        return false;
      }

      return data.permalink;
    };
  });

  // When `eleventyExcludeFromCollections` is true, the file is not included in any collections
  eleventyConfig.addGlobalData('eleventyComputed.eleventyExcludeFromCollections', function () {
    return data => {
      if (shouldExclude(data)) {
        return true;
      }

      return data.eleventyExcludeFromCollections ?? false;
    };
  });

  eleventyConfig.on('eleventy.before', ({runMode}) => {
    if (runMode === 'serve' || runMode === 'watch') {
      process.env.BUILD_DRAFTS = true;
    }
  });
};
