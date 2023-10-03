/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  appDirectory: 'src/app',
  serverDependenciesToBundle: [/@mui\/.*/],
  serverMinify: true,
}
