export const genHref = (project: string, file: string, isGall: boolean) => `/${project}/${isGall ? encodeURIComponent(file) : file}`
