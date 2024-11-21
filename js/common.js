async function toggleVideo(url) {
  const currentState = await senza.lifecycle.getState();
  if (
    currentState === "background" ||
    currentState === "inTransitionToBackground"
  ) {
    senza.lifecycle.moveToForeground();
  } else {
    await playVideo(url);
  }
}

async function playVideo(url) {
  try {
    await senza.remotePlayer.load(url);
    senza.remotePlayer.play();
  } catch (error) {
    console.log("Couldn't load remote player.", error);
  }
}

function goBack() {
  window.history.back();
}
