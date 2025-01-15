const axios = require('axios');
const EventSource = require('eventsource'); 
const session_hash = Math.random().toString(36).slice(2);

const logoGenerator = {
  request: async (prompt) => {
    const data = JSON.stringify({
      "data": [
        prompt,
        0,
        true,
        512,
        512,
        4
      ],
      "event_data": null,
      "fn_index": 1,
      "trigger_id": 6,
      "session_hash": session_hash
    });

    const config = {
      method: 'POST',
      url: 'https://fantaxy-ofai-flx-logo.hf.space/gradio_api/queue/join?__theme=system',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803; Build/OPM1.171019.026) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.4280.141 Mobile Safari/537.36 KiToBrowser/124.0',
        'Content-Type': 'application/json',
        'accept-language': 'id-ID',
        'referer': 'https://fantaxy-ofai-flx-logo.hf.space/?__theme=system',
        'origin': 'https://fantaxy-ofai-flx-logo.hf.space',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'priority': 'u=4',
        'te': 'trailers'
      },
      data: data
    };

    const api = await axios.request(config);
    return api.data;
  },
  cekStatus: () => {
    return new Promise((resolve, reject) => {
      const eventSource = new EventSource(
        'https://fantaxy-ofai-flx-logo.hf.space/gradio_api/queue/data?session_hash=' + session_hash
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.msg === "process_completed") {
          resolve(data);
          eventSource.close();
        } else if (data.msg === "error") {
          reject(data);
          eventSource.close();
        } else {
          console.log("Event:", data);
        }
      };

      eventSource.onerror = (err) => {
        reject(err);
        eventSource.close();
      };
    });
  },
  create: async (prompt) => {
    const postResponse = await logoGenerator.request(prompt);
    const statusResponse = await logoGenerator.cekStatus();
    return statusResponse;
  }
};

module.exports = logoGenerator;
        
