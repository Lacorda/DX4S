import resolvePathname from 'resolve-pathname';

const ensureLeadingAndTrailingSlashes = path => path.replace(/^\/?/, '/').replace(/\/?$/, '/');
const removeTrailingSlash = path => path.replace(/\/$/, '') || '/';
const removeLeadingHash = path => path.replace(/^#/, '');

const determineCurrentPath = (currentPath) => {
  if (!currentPath) {
    if (global.location && global.location.hash) {
      currentPath = removeLeadingHash(global.location.hash);
    } else {
      currentPath = '/';
    }
  }
  return ensureLeadingAndTrailingSlashes(currentPath);
};

const resolvePathnameNoTrailingSlash = (path, currentPath) => (
  removeTrailingSlash(resolvePathname(path, currentPath))
);

const getAbsPath = (to, currentPath) => {
  const pathParts = removeTrailingSlash(determineCurrentPath(currentPath)).split('?');
  return `${resolvePathnameNoTrailingSlash(to, `${pathParts[0]}/`)}?${pathParts[1]}`;
};

export default getAbsPath;
