const logVisit = async (pageName, userConsent) => {
  const visitTime = new Date();
  const skipLogVisit = !userConsent;
  try {
    if (!skipLogVisit) {
      await fetch('/.netlify/functions/record', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pageName,
          visitTime: { time: visitTime, tz: visitTime.getTimezoneOffset() }
        })
      });
    }
  } catch (e) {
    console.log(e);
  }
};

//logVisit('/', true)

async function hello() {
  const response = await fetch('/.netlify/functions/hello').then(response => response.json()).catch()
  console.log(response);
}