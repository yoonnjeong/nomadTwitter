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
  overflow-y: scroll;
`;

export interface ITweet {
  // 인테페이스 정의
  id: string;
  photo?: string; // 해당 타입이 문자열이거나 없을 수 있다
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
  updateAt?: number;
}

export default function Timeline() {
  //React에 tweets배열이고, 기본 값을 빈 배열이라고 정의
  const [tweets, setTweet] = useState<ITweet[]>([]);

  useEffect(() => {
    //  unsubscribe 는 추후 사용자가 Timeline 컴포넌트를 보고있지 않을 때, 서버에서 변경점이 있을경우 계속 값을 요청하지 않기 위해 쓸것임. (최적화, 비용 절감)
    let unsubscribe: Unsubscribe | null = null;

    // 실제 서버에서 데이터를 요청하는 함수
    const fetchTweets = async () => {
      const tweetsQuery = query(
        // 쿼리 생성
        collection(db, "tweets"), // 어떤 컬렉션을 쿼리로 지정하고 싶은지 지정
        orderBy("createdAt", "desc"), // 최신 순으로 내림차순 정렬
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
      // }); // getDocs로도 사용 가능하나 실시간 반응을 안함

      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        //문서를 한 번만 가져오는 대신 퀴리에 리스너를 추가해서 문서의 변화가 생기면
        // snapshot 문서를 배열로 반환한다 (snapshot.docs)
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo, updateAt } =
            doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
            updateAt: updateAt || null,
            // doc.id 는 문서의 고유 id, userId 와는 다름.
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
