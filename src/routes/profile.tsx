import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Tweet from "../components/tweet";
import { Error } from "../components/auth-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;
const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-bottom: 100px;
`;
const EditNameTextEField = styled.textarea`
  border: 2px solid #fff;
  padding: 20px;
  border-radius: 20px;
  height: 66px;
  font-size: 16px;
  color: #000;
  background-color: #fff;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;
const EditNameButton = styled.button`
  display: block;
  background-color: tomato;
  color: #fff;
  border: 0;
  font-weight: 600;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
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

export default function Profile() {
  const user = auth.currentUser;
  const [avartar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [newName, setNewName] = useState("");
  const [isEdit, setEditing] = useState(false);
  const [errorEditName, setErrorEditName] = useState("");

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      if (files[0].size > 1024 * 1024) {
        alert("1MB 이하의 사진만 업로드 가능합니다.");
        return;
      }
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, { photoURL: avatarUrl });
    }
  };

  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid), // tweets들의 구조를 참조 할수 있다, userId가 현재 로그인한 user의 uid와 같다면
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetsQuery);
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
      };
    });
    setTweets(tweets);
  };
  const onClickEditName = () => {
    setEditing(true);
  };
  const onClickApplyName = async () => {
    setErrorEditName("");
    if (!user) {
      return;
    }
    if (newName === "") {
      setErrorEditName("Can't change to empty name.");
      return;
    }
    await updateProfile(user, {
      displayName: newName,
    });
    setEditing(false);
  };
  const onChangeEditNameField = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = e;
    setNewName(value);
  };
  useEffect(() => {
    fetchTweets();
    if (user && user.displayName) {
      setNewName(user.displayName);
    }
  }, []);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avartar ? (
          <AvatarImg src={avartar} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      {/* <Name>{user?.displayName ? user.displayName : "Anonymous"}</Name> */}
      {/* <Name>{user?.displayName ?? "Anonymous"}</Name> */}
      {isEdit ? (
        <>
          <EditNameTextEField
            onChange={onChangeEditNameField}
            value={newName}
          />
          <EditNameButton onClick={onClickApplyName}>Apply</EditNameButton>
          {errorEditName !== "" ? <Error>{errorEditName}</Error> : null}
        </>
      ) : (
        <>
          <Name>{user?.displayName ?? "Anonymous"}</Name>
          <EditNameButton onClick={onClickEditName}>Edit</EditNameButton>
        </>
      )}
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
