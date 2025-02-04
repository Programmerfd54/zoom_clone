"use client";

import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import Loader from './Loader';

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import ReactDatePicker from "react-datepicker";

import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";


const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
}

const MeetingTypeList = () => {

  const router = useRouter();
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()


  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();

  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({ title: 'Пожалуйста, выберите дату и время' });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) throw new Error('Ошибка при создании встречи');
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetail(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: 'Встреча создана!',
      });
    } catch (error) {
      console.error(error);
      toast({ title: 'Ошибка при создании встречи' });
    }
  };

  if (!client || !user) return <Loader />;

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard 
          img="/icons/add-meeting.svg"
          title="Новая встреча"
          description="Начать мгновенную встречу"
          handleClick={() => setMeetingState('isInstantMeeting')}
          className="bg-orange-1"

        />
        <HomeCard 
          img="/icons/schedule.svg"
          title="Расписание встреч"
          description="Планирование ваших встреч"
          handleClick={() => setMeetingState('isScheduleMeeting')}
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
          handleClick={() => setMeetingState('isJoiningMeeting')}
          className="bg-yellow-1"
        />
        {!callDetail ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Создание встречи"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Добавьте описание
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Выберите дату и время
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Встреча создана"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Ссылка скопирована' });
          }}
          image={'/icons/checked.svg'}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Копировать ссылку на встречу"
        />
      )}


        <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Введите ссылку здесь"
        className="text-center"
        buttonText="Присоединиться к встрече"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Ссылка встречи"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Начать внезапную встречу"
        className="text-center"
        buttonText="Начать созвон"
        handleClick={createMeeting}
      />
    </section>
  )
}

export default MeetingTypeList
