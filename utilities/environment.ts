const getValue = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(
      `Environment variable ${key} is not defined. Did you setup your environment variables correctly?`
    );
  }

  return value;
};

const environment = {
  riotToken: getValue("RIOT_TOKEN"),
  firebase: {
    clientEmail: getValue("FIREBASE_CLIENT_EMAIL"),
    privateKey: getValue("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    projectId: getValue("FIREBASE_PROJECT_ID"),
  },
};

export default environment;
