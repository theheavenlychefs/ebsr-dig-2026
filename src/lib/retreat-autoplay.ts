export async function playRetreatPreview(video: HTMLVideoElement, mayPlay: () => boolean): Promise<boolean> {
  if (!mayPlay()) return false;
  try {
    await video.play();
  } catch (error) {
    // Only a browser policy rejection warrants retrying without sound.
    if (!mayPlay() || video.muted || (error as { name?: string })?.name !== "NotAllowedError") return false;
    video.muted = true;
    try {
      await video.play();
    } catch {
      return false;
    }
  }
  if (!mayPlay()) {
    video.pause();
    return false;
  }
  return true;
}
