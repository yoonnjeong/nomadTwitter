import styled from "styled-components";
import { ITweet } from "./timline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import EditTweetForm from "./edit-tweet-form";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  & + div {
    margin-top: 20px;
  }
`;
const Column = styled.div``;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  object-fit: cover;
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
const Payload = styled.p`
  margin: 10px 0;
  font-size: 18px;
`;
const Row = styled.div`
  display: flex;
  margin-top: 20px;
`;

// const DeleteButton = styled.button`
//   background-color: tomato;
//   color: #fff;
//   border: 0;
//   font-weight: 600;
//   font-size: 12px;
//   padding: 5px 10px;
//   text-transform: uppercase;
//   border-radius: 5px;
//   cursor: pointer;
// `;
// const EditButton = styled.button`
//   background-color: #999;
//   color: #fff;
//   border: 0;
//   font-weight: 600;
//   font-size: 12px;
//   padding: 5px 10px;
//   text-transform: uppercase;
//   border-radius: 5px;
//   cursor: pointer;
//   margin-right: 6px;
// `;
const TweetButton = styled.button<{ color?: string }>`
  background-color: ${(props) => props.color || "tomato"};
  color: #fff;
  border: 0;
  font-weight: 600;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 6px;
`;

// 지정한 값만 넘어오도록 하게 하기
export default function Tweets({
  username,
  photo,
  tweet,
  userId,
  id,
  updateAt,
  createdAt,
}: ITweet) {
  const [editToggle, setEditToggle] = useState(false);
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return; // 확인 버튼을 누를 경우에만 삭제
    if (user?.uid !== userId) return; // 사용자 아이디가 다를 경우 삭제 못함
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(
          // 사진 경로 받아오기
          storage,
          `tweets/${user.uid}/${id}`
        );
        await deleteObject(photoRef); // 사진 삭제
      }
    } catch (error) {
      console.log(error);
    } finally {
      //
    }
  };
  const onEditClicked = () => {
    setEditToggle(!editToggle);
  };
  const updateAtDate = new Date(updateAt as number);
  const createdAtDate = new Date(createdAt as number);

  const updateAtString = updateAtDate.toLocaleString(); // 수정된 날짜와 시간을 읽기 쉬운 형태로 변환
  const createdAtString = createdAtDate.toLocaleString(); // 생성된 날짜와 시간을 읽기 쉬운 형태로 변환

  return (
    <Wrapper>
      <Column>
        <Username>
          {username}{" "}
          {updateAt ? ` | (수정된 트윗) ${updateAtString}` : createdAtString}
        </Username>
        {editToggle ? (
          <EditTweetForm
            tweet={tweet}
            userId={userId}
            id={id}
            photo={photo}
            setEditToggle={setEditToggle}
          />
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {/* 삭제는 현재 로그인된 유저와 트윗의 userId 가 같을 때만 가능 */}
        {user?.uid === userId ? (
          <Row>
            {user?.uid === userId ? (
              <TweetButton onClick={onDelete}>Delete</TweetButton>
            ) : null}
            {user?.uid === userId ? (
              <TweetButton color="gray" onClick={onEditClicked}>
                {editToggle ? "Cancel" : "Edit"}
              </TweetButton>
            ) : null}
          </Row>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
