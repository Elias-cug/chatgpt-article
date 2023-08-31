const serviceEnv = {
  dev: {
    urlForBase: 'https://survey.work/api',
    urlForSuperTable: 'http://test.api.jc.survey.work'
  },
  test: {
    urlForBase: 'https://survey.work/api',
    urlForSuperTable: 'http://test.api.jc.survey.work'
  },
  prod: {
    urlForBase: 'https://survey.work/api',
    urlForSuperTable: 'https://api-jc.survey.work'
  }
}

export function getServiceEnvConfig(env: any) {
  const { VITE_SERVICE_ENV = 'dev' } = env;

  const config = serviceEnv[VITE_SERVICE_ENV];

  return config;
}