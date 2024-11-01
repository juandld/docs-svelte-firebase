const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  const { GoogleAIFileManager } = require("@google/generative-ai/server");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const fileManager = new GoogleAIFileManager(apiKey);
  
  /**
   * Uploads the given file to Gemini.
   *
   * See https://ai.google.dev/gemini-api/docs/prompting_with_media
   */
  async function uploadToGemini(path, mimeType) {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  }
  
  /**
   * Waits for the given files to be active.
   *
   * Some files uploaded to the Gemini API need to be processed before they can
   * be used as prompt inputs. The status can be seen by querying the file's
   * "state" field.
   *
   * This implementation uses a simple blocking polling loop. Production code
   * should probably employ a more sophisticated approach.
   */
  async function waitForFilesActive(files) {
    console.log("Waiting for file processing...");
    for (const name of files.map((file) => file.name)) {
      let file = await fileManager.getFile(name);
      while (file.state === "PROCESSING") {
        process.stdout.write(".")
        await new Promise((resolve) => setTimeout(resolve, 10_000));
        file = await fileManager.getFile(name)
      }
      if (file.state !== "ACTIVE") {
        throw Error(`File ${file.name} failed to process`);
      }
    }
    console.log("...all files ready\n");
  }
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run() {
    // TODO Make these files available on the local file system
    // You may need to update the file paths
    const files = [
      await uploadToGemini("transcript.txt", "text/plain"),
    ];
  
    // Some files have a processing delay. Wait for them to be ready.
    await waitForFilesActive(files);
  
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "This is a transcript of an audio of a person speaking.\n\nThese are your tasks:\n1. Make sense of the transcript, since it can be misheard or there can be noise, your task is to make sure the text makes sense depending on context and word similarity\n2. Get rid of any filler words and redundancies, such as helper phrases like: \"you know\" or \"do you feel me?\"\n"},
            {
              fileData: {
                mimeType: files[0].mimeType,
                fileUri: files[0].uri,
              },
            },
          ],
        },
        {
          role: "model",
          parts: [
            {text: "I envision an application that takes my spoken words and transforms them into coherent ideas. Imagine being able to talk to a computer and receive a polished, publishable result. The AI handles the heavy lifting, allowing people to focus solely on the narrative, the heart of the story. This could be a game-changer for YouTube or TikTok, where creators could concentrate on the story and feel without technical constraints. \n\nI also want to use this technology to preserve the memories and culture of older generations. Many seniors have fascinating life stories to tell, but may not be willing or able to write them down. My app would allow them to share their stories through conversation, creating a more interactive and engaging experience. \n\nThis could help bridge cultural divides by sharing diverse stories and fostering greater understanding between different races and cultures. \n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "Now we need to make sure the idea os cohesive and has a point of focus.\n\n1. not all users have the way of getting out what they are thinking with words, narrow down on a topic and give me 3 options as to what is the main focus so that the user can select it.\n\n2. topics can progress in many different ways, and there are infinite ways to make a point, we also need to narrow down how is it that the user wants this text to be experienced, from what angle of attack as to how this information might be shared, also have in consideration what feelings we might want to provoke, give me another 3 options so that the user can select."},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "## Narrowing Down the Focus:\n\n**1. Main Focus Options:**\n\n* **Storytelling for Seniors:**  This focuses on capturing and sharing the life stories of older generations, aiming to preserve their memories and cultural heritage. \n* **Creative Writing Assistance:** This focuses on aiding writers in generating ideas, structuring narratives, and polishing their writing,  enabling them to express their creative visions more effectively.\n* **Conversational AI for Content Creation:** This focuses on using conversational AI to generate diverse forms of content, such as blog posts, scripts, or even social media posts, based on user input. \n\n**2.  Angle of Attack and Feelings:**\n\n* **Personal & Emotional:**  Focus on the deeply personal and emotional stories of individuals, aiming to evoke empathy, understanding, and connection. \n* **Informative & Engaging:**  Focus on conveying knowledge and information in a compelling and engaging manner, aiming to educate and inspire.\n* **Creative & Imaginative:**  Focus on fostering imagination and creative expression, allowing users to explore new ideas and narratives in an uninhibited way. \n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "1. User selection Main focus: Creative writing assistance.\n2.User selection Angle of attack: Personal and Emotional.\n\nPlease edit the text that follows the  users selections and makes a complete and cohesive text that is true to the options selected and the original texts intention.\n\nMake a list of every topic touched in the original text and make sure to add at least a mention to each one, without loosing focus."},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Imagine a tool that could help you unlock the stories hidden within your heart. A tool that listens to your whispered thoughts, your unformed ideas, and helps you shape them into a compelling narrative. \n\nThis is the power of a creative writing assistant that focuses on your unique perspective and emotional journey. It can help you bring your most personal stories to life, capturing the raw emotions, the hidden nuances, and the profound impact of your experiences.\n\nIt's not about crafting perfect sentences or following rigid formulas. It's about finding the words that truly resonate with your soul, and giving voice to the stories that matter most.\n\nThis tool is for anyone who feels a story bubbling inside them, but struggles to find the right way to express it. It's for the writer who yearns to share their truth, their vulnerabilities, and the lessons learned along the way. \n\nAnd while it aims to help individuals find their voice, it also acknowledges the importance of preserving the stories of others. It can be used to capture the rich tapestry of experiences passed down through generations, ensuring that the voices of our elders, with their wisdom and unique perspectives, are never forgotten. \n\nBy fostering a deeper understanding of ourselves and each other, we can bridge the gap between cultures and create a world where every story matters. \n"},
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    console.log(result.response.text());
  }
  
  run();