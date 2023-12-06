import {
  Unsubscribe,
  collection,
  limit,
  // getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export interface ITweet {
  // 인테페이스 정의
  id: string;
  photo?: string; // 해당 타입이 문자열이거나 없을 수 있다
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

export default function Timeline() {
  //React에 tweets배열이고, 기본 값을 빈 배열이라고 정의
  const [tweets, setTweet] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    // fetchTweets 바동기 함수 호출
    const fetchTweets = async () => {
      const tweetsQuery = query(
        // 쿼리 생성
        collection(db, "tweets"), // 어떤 컬렉션을 쿼리로 지정하고 싶은지 지정
        orderBy("createdAt", "desc"), // 최신 순으로 정렬
        limit(25) // 구독료를 절약하기 위해 페이지네이션을 만든다
      );
      // 문서 가져오기, getDocs의 결과는 쿼리의 snapshot을 받게 된다
      // const snapshot = await getDocs(tweetsQuery);
      // 각 문서에 접근해서 문서 데이터 출력
      // forEach대신 map함수로 배열 반환, 트윗에서 ITweet를 만족하는 데이터 추출
      // const tweets = snapshot.docs.map((doc) => {
      //   const { tweet, createdAt, userId, username, photo } = doc.data();
      //   return {
      //     tweet,
      //     createdAt,
      //     userId,
      //     username,
      //     photo,
      //     id: doc.id,
      //   };
      // });
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        //문서를 한 번만 가져오는 대신 퀴리에 리스너를 추가해서 문서의 변화가 생기면
        // snapshot 문서를 배열로 반환한다 (snapshot.docs)
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweet(tweets); //추출한 데이터를 받아서 화면에 출력
      });
    };
    fetchTweets(); // 로드시 fetchTweets 호출
    return () => {
      // useEffect은 더 이상 타임라인 컴포넌트가 사용되지 않을 때 이 함수 호출
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  ); //tweets 문자로 변경
}
