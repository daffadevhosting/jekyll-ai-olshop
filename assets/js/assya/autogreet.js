// autogreet.js
// Greeting & help di awal chat

export async function autogreet(handleIntent, renderReply, chatBox) {
  if (!sessionStorage.getItem("sudahGreeted")) {
    const greet = await handleIntent("greeting");
    renderReply(greet, chatBox);
    sessionStorage.setItem("sudahGreeted", "1");
  }
  const help = await handleIntent("help");
  renderReply(help, chatBox);
}
