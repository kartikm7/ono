"use client";
import { Card, playerAtom, Room, roomStateAtom, socket } from "@/atom";
import OnoCard from "@/components/ono-card";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Separator } from "@/components/ui/separator";
import { useAtom } from "jotai";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Play() {
  // declaring the hooks
  const [roomState, setRoomState] = useAtom(roomStateAtom);
  const [playerState, setPlayerState] = useAtom(playerAtom);
  const currentPlayerIndex = roomState?.players.findIndex(
    (val) => val.username == playerState?.username
  );
  function updatePlayerState(room: Room) {
    // now we need to extract the player details from the gameState
    const currentPlayer = room?.players.find(
      (val) => val.username == playerState?.username
    );
    setPlayerState(currentPlayer);
  }

  useEffect(() => {
    socket.on("roomState", (message) => {
      setRoomState(message);
      updatePlayerState(message);
      console.log(roomState)
    });
    socket.on("notification", (message) => {
      toast.info(message);
    });
    // now we need to extract the player details from the gameState
    const currentPlayer = roomState?.players.find(
      (val) => val.username == playerState?.username
    );

    // const currentPlayerIndex = roomState?.players.findIndex(val => val.username == currentPlayer?.username)
    setPlayerState(currentPlayer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClick(card: Card, index: number) {
    const currentPlayerIndex = roomState?.players.findIndex(
      (val) => val.username == playerState?.username
    );
    if (
      currentPlayerIndex != -1 &&
      currentPlayerIndex == roomState?.gameState.currentPlayerIndex
    ) {
      socket.emit("play", {
        card: card,
        roomId: roomState?.roomId,
        username: playerState?.username,
        index: index,
      });
    } else {
      toast.error("Tera turn nhi hai champ");
    }
  }

  function handleDraw(){
    socket.emit('draw',{roomId: roomState?.roomId, username: playerState?.username})
  }

  return (
    <div className="relative flex flex-col w-full h-screen">
      <div className="fixed z-50 backdrop-blur-md dark:bg-black dark:bg-opacity-50 rounded-md  flex flex-col justify-center items-start p-2 gap-2">
        {roomState?.gameState.winners &&  roomState?.gameState.winners.length > 0 && <>
            <div>
              <h1>Winners</h1>
              <Separator />
            </div>
            {roomState.gameState.winners.map((val, index)=>{
              return             <div
              className={`text-sm text-green-400`}
              key={index}
            >
              {val == playerState?.username
                ? playerState.username + " (You)"
                : val}
            </div>

            })}
          </>}
        <div className="">
          <h1 className="">Players in the room</h1>
          <Separator />
        </div>
        {roomState?.players.map((val, index) => {
          return (
            <div
              className={`text-sm ${
                index == roomState.gameState.currentPlayerIndex &&
                "underline text-blue-400"
              }`}
              key={index}
            >
              {val.username == playerState?.username
                ? playerState.username + " (You)"
                : val.username}
            </div>
          );
        })}
        <Separator />
        {currentPlayerIndex == roomState?.gameState.currentPlayerIndex && <RainbowButton className="cursor-pointer w-full" onClick={() => {handleDraw()}}>Utha le</RainbowButton>}
      </div>
      <div className="relative flex flex-col justify-center items-center">
        <OnoCard
          className="absolute bg-background"
          value={roomState?.gameState.discardDeck.at(-1)?.value}
          type={roomState?.gameState.discardDeck.at(-1)?.type}
        />
        <Image src={"/chatai.png"} alt="chatai" width={700} height={500} />
      </div>
      <div className="flex justify-center items-center gap-2 ">
        {!roomState?.gameState.winners.includes(String(playerState?.username)) ? playerState?.hand.map((card, index) => {
          return (
            <OnoCard
              onClick={() => {
                handleClick(card, index);
              }}
              className="hover:mb-5 transition-all cursor-pointer"
              key={index}
              value={card.value}
              type={card.type}
            />
          );
        }) : <h1>You won bro, 8 uthane hai kya fir bhi?</h1>}
      </div>
    </div>
  );
}
