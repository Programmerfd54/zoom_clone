"use client";

import { useRouter } from "next/navigation";
import HomeCard from "./HomeCard";
import { useState } from "react";
import MeetingModal from "./MeetingModal";

const MeetingTypeList = () => {

  const router = useRouter();
  const [meetingState, setmeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()

  const createMeeting = () => {

  }

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard 
          img="/icons/add-meeting.svg"
          title="Новая встреча"
          description="Начать мгновенную встречу"
          handleClick={() => setmeetingState('isInstantMeeting')}
          className="bg-orange-1"

        />
        <HomeCard 
          img="/icons/schedule.svg"
          title="Расписание встреч"
          description="Планирование ваших встреч"
          handleClick={() => setmeetingState('isScheduleMeeting')}
          className="bg-blue-1"
        />
        <HomeCard 
          img="/icons/recordings.svg"
          title="Посмотреть записи"
          description="Посмотрите свои записи"
          handleClick={() => router.push('/recordings')}
          className="bg-purple-1"

        />
        <HomeCard 
          img="/icons/join-meeting.svg"
          title="Присоединиться к встречи"
          description="по ссылке-приглашению"
          handleClick={() => setmeetingState('isJoiningMeeting')}
          className="bg-yellow-1"
        />


        <MeetingModal
          isOpen={meetingState === 'isInstantMeeting'}
          onClose={() => setmeetingState(undefined)}
          title="Начать мгновенную встречу"
          className="text-center"
          buttonText="Запустить"
          handleClick={createMeeting}
        />
    </section>
  )
}

export default MeetingTypeList
