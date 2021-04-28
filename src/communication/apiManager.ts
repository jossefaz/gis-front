export async function fetchData(properties: any) {
  try {
    let url = properties.url;
    if (properties.functionName !== undefined)
      url = url + properties.functionName;
    const response = await fetch(url, {
      method: properties.mode,
      body: properties.body,
    });

    if (!response.ok) {
      throw Error(response.statusText);
    }

    var data = await response.json();
    return data;
  } catch (error) {}
}

export async function getXMLResponse(url: any) {
  try {
    const response = await fetch(url);
    let data = await response.text();
    return data;
  } catch (error) {
    console.log(error);
  }

  // .then((response) => {
  //     let data = response.text()
  //     console.log(data);
  // }).then((textResponse) => {
  //     let obj = parse(textResponse);
  //     console.log("this is data:" + obj);
  //     // let fname = obj.person.fname;
  //     // let lname = obj.person.lname;
  //     // let phone = obj.person.contacts.personal.phone;
  //     // this.setState({ fname: fname, lname: lname, phone: phone })
  // })
  // .catch((error) => {
  //     console.log(error);
  // });
}
