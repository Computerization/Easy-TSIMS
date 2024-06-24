//https://nitro.unjs.io/config
export default defineNitroConfig({
  runtimeConfig: {
    tsimsUrl: process.env.TSIMS_URL!, // `dev_token` is the default value
  },
  srcDir: "server"
});
