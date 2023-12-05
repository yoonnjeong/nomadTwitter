import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";

const Wrapper = styled.div``;

export interface ITweet {
  // 인테페이스 정의
  photo: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

export default function Timeline() {
  //React에 tweets배열이고, 기본 값을 빈 배열이라고 정의
  const [tweets, setTweet] = useState<ITweet[]>([]);

  // fetchTweets 바동기 함수 호출
  const fetchTweets = async () => {
    const tweetsQuery = query(
      // 쿼리 생성
      collection(db, "tweets"), // 어떤 컬렉션을 쿼리로 지정하고 싶은지 지정
      orderBy("createdAt", "desc") // 최신 순으로 정렬
    );
    // 문서 가져오기, getDocs의 결과는 쿼리의 snapshot을 받게 된다
    const snapshot = await getDocs(tweetsQuery);
    snapshot.docs.forEach((doc) => console.log(doc.data()));
  };
  useEffect(() => {
    fetchTweets(); // 로드시 fetchTweets 호출
  }, []);
  return <Wrapper>{JSON.stringify(tweets)}</Wrapper>; //tweets 문자로 변경
}
