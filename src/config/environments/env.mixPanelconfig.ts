interface MixPanelConfig {
  mixpanel?:{
        token?:string;
        apiKey?: string;
    }
}

const mixPanelConfig: MixPanelConfig = {
  mixpanel: {
    token: process.env.MIX_PANNEL_TOKEN ?? '',
    apiKey: process.env.MIX_PANNEL_API_KEY ?? ''
  },
  

};

export default mixPanelConfig;
