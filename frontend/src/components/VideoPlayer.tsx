import React from "react";
import ReactPlayer from "react-player";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";

interface VideoPlayerProps {
    width?: string;
    height?: string;
    url: string | undefined;
    onProgressUpdate?: (progress: number) => void;
    progressData?: any;
}
function VideoPlayer({ width = "100%", height = "100%", url, onProgressUpdate, progressData }: VideoPlayerProps): React.ReactElement {
  const [playing, setPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(0.5);
  const [muted, setMuted] = React.useState(false);
  const [played, setPlayed] = React.useState(0);
  const [seeking, setSeeking] = React.useState(false);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);

  const playerRef = React.useRef<ReactPlayer>(null);
  const playerContainerRef = React.useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = React.useRef<number | null>(null);

  const handlePlayAndPause = React.useCallback(() => {
    setPlaying(!playing);
  }, [playing]);

  const handleProgress = React.useCallback(
    (state: any) => {
      if (!seeking) {
        setPlayed(state.played);
      }
    },
    [seeking]
  );

  const handleRewind = React.useCallback(() => {
    playerRef.current?.seekTo(playerRef.current.getCurrentTime() - 5);
  }, [playerRef]);

  const handleForward = React.useCallback(() => {
    playerRef.current?.seekTo(playerRef.current.getCurrentTime() + 5);
  }, [playerRef]);

  const handleToggleMute = React.useCallback(() => {
    setMuted(!muted);
  }, [muted]);

  const handleSeekChange = React.useCallback(
    (newValue: number[]) => {
      setPlayed(newValue[0]);
      setSeeking(true);
    },
    []
  );

  const handleSeekMouseUp = React.useCallback(() => {
    setSeeking(false);
    playerRef.current?.seekTo(played);
  }, [played, playerRef]);

  const handleVolumeChange = React.useCallback(
    (newValue: number[]) => {
      setVolume(newValue[0]);
    },
    []
  );

  const pad = React.useCallback(
    (string: string) => {
      return ("0" + string).slice(-2);
    },
    []
  );

  const formatTime = React.useCallback(
    (seconds: number) => {
      const date = new Date(seconds * 1000);
      const hh = date.getUTCHours();
      const mm = date.getUTCMinutes();
      const ss = pad(date.getUTCSeconds().toLocaleString());

      if (hh) {
        return `${hh}:${pad(`${mm}`)}:${ss}`;
      }

      return `${mm}:${ss}`;
    },
    [pad]
  );

  const handleFullScreen = React.useCallback(() => {
    if (!isFullScreen) {
      playerContainerRef.current?.requestFullscreen();
    } else { document.exitFullscreen(); }
  }, [isFullScreen, playerContainerRef]);

  const handleMouseMove = React.useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef?.current || 0);
    controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
  }, [controlsTimeoutRef]);

  React.useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  React.useEffect(() => {
    if (played === 1) {
      onProgressUpdate && onProgressUpdate({
        ...progressData,
        progressValue: played,
      });
    }
  }, [played, onProgressUpdate, progressData]);

  return (
    <div
      ref={playerContainerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out 
      ${isFullScreen ? "w-screen h-screen" : ""}
      `}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
      />
      {showControls && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <Slider
            value={[played * 100]}
            max={100}
            step={0.1}
            onValueChange={(value) => handleSeekChange([value[0] / 100])}
            onValueCommit={handleSeekMouseUp}
            className="w-full mb-4"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayAndPause}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
              >
                {playing ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                onClick={handleRewind}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleForward}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                <RotateCw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleToggleMute}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                {muted ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                className="w-24 "
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-white">
                {formatTime(played * (playerRef.current?.getDuration() || 0))}/{" "}
                {formatTime(playerRef.current?.getDuration() || 0)}
              </div>
              <Button
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
                onClick={handleFullScreen}
              >
                {isFullScreen ? (
                  <Minimize className="h-6 w-6" />
                ) : (
                  <Maximize className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
