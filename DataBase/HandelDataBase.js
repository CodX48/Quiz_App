const fs = require('fs');

const optionsArray = [
    { text: "Any Category", id: "" },
    { text: "General Knowledge", id: "9" },
    { text: "Entertainment: Books", id: "10" },
    { text: "Entertainment: Film", id: "11" },
    { text: "Entertainment: Music", id: "12" },
    { text: "Entertainment: Musicals & Theatres", id: "13" },
    { text: "Entertainment: Television", id: "14" },
    { text: "Entertainment: Video Games", id: "15" },
    { text: "Entertainment: Board Games", id: "16" },
    { text: "Science & Nature", id: "17" },
    { text: "Science: Computers", id: "18" },
    { text: "Science: Mathematics", id: "19" },
    { text: "Mythology", id: "20" },
    { text: "Sports", id: "21" },
    { text: "Geography", id: "22" },
    { text: "History", id: "23" },
    { text: "Politics", id: "24" },
    { text: "Art", id: "25" },
    { text: "Celebrities", id: "26" },
    { text: "Animals", id: "27" },
    { text: "Vehicles", id: "28" },
    { text: "Entertainment: Comics", id: "29" },
    { text: "Science: Gadgets", id: "30" },
    { text: "Entertainment: Japanese Anime & Manga", id: "31" },
    { text: "Entertainment: Cartoon & Animations", id: "32" }
  ];
  
  async function fetchData(info) {
    const response = await fetch(`https://opentdb.com/api.php?amount=${info.amount}&category=${info.Id}&difficulty=${info.Difficulty}&type=${info.Type}`);
    return response.json();
  }
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));  // Delay function that returns a promise
  }
  
  const Data = {};


function writeData(DatabaseOJ){
    const jsonData = JSON.stringify(DatabaseOJ, null, 2); // null and 2 add pretty-printing

    // Write the JSON string to a file
        fs.writeFile('data.json', jsonData, (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('Data successfully written to file');
                }
        });
}
  
  console.log(Data);
  
  async function handleData() {
    for (const ele of optionsArray) {
        if (!ele.id) continue;
        
        if (!Data[ele.id]) {
            
          Data[ele.id] = {
            "multiple": { "hard": 0, "medium": 0, "easy": 0 },
            "boolean": { "hard": 0, "medium": 0, "easy": 0 }
          };
        }

        for (const difficulty of ["hard", "easy", "medium"]) {
          for (const type of ["multiple", "boolean"]) {
            const info = { Id: ele.id, Difficulty: difficulty, Type: type };
  
            try {
                const numQuestions = await numofQ(info);
                Data[ele.id][type][difficulty] = numQuestions;
              console.log("Updated Data:", Data);
            } catch (err) {
              console.error("Error:", err);
              return `Error: ${err}`;
            }
          }
        }
        writeData(Data);
    }
    console.log("Final Data:", Data);
    
  }
  
  async function numofQ(info) {
    let low = 1;
    let high = 50;
    let mid;
  
    while (low < high - 1) {
      mid = Math.floor((low + high) / 2);
      let testQ = { ...info, amount: mid };
  
      // Fetch data to check if the amount is valid
      await delay(5000);
      try {
        let data = await fetchData(testQ);
        //console.log(data.response_code)
        if (data.response_code === 0) {
          low = mid; 
        } else {
          high = mid; 
        }
      } catch (error) {
        console.error(`Error querying API with mid ${mid}:`, error); // Catch network or API errors
        throw new Error("Failed to query the API.");
      }
    }
    return low;
  }
  
  handleData();

  