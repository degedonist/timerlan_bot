import { Input } from "telegraf";

export const text_to_speech = async (data, ctx) => {
  let clean_data = ''

    const cleanup = async (data) => {
      await fetch("http:/localhost:3333/", { method:'DELETE', body:data })
      .catch((error) => {throw error})
    }

  await fetch("http:/localhost:3333/", { method:'POST', body:data })
  .then((response) => response = response.text())
  .then((response) => clean_data += response)
  .then((response) => ctx.replyWithVoice(Input.fromLocalFile(`C:/Users/Пользователь/Desktop/web/test-to-speech/voices/${response}`)))
  .catch((error) => {throw error});

  console.log(clean_data);

  cleanup(clean_data);
};