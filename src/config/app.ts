interface AppConfig {
  name: string;
  github: {
    title: string;
    url: string;
    name: string
  };
  author: {
    name: string;
    url: string;
  };
  instagram: {
    name: string;
    url: string;
  };
  linkedIn: {
    name: string;
    url: string;
  };
  website: {
    name: string;
    url: string;
  };
}

export const appConfig: AppConfig = {
  name: "Label Creator",
  github: {
    title: "React Shadcn Starter",
    url: "https://github.com/sulavJung",
    name: "sulavJung"
  },
  author: {
    name: "Sulav",
    url: "https://github.com/sulavJung/",
  },
  instagram: {
    name: "sulav_hamal",
    url: "https://www.instagram.com/sulav_hamal/",
  },
  linkedIn: {
    name: "sulav-jung",
    url: "https://www.linkedin.com/in/sulavjunghamal/",
  },
  website: {
    name: "sulavhamal.com",
    url: "https://sulavhamal.com/",
  },
};
