import styled from "styled-components";
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

interface TweetInfo {
  tweet: string;
  userId: string;
  id: string;
  setEditToggle: React.Dispatch<React.SetStateAction<boolean>>;
  photo?: string;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 20px 0 0;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  cursor: pointer;
  border-radius: 20px;
  padding: 10px 0px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  color: #1d9bf0;
  border: 1px solid #1d9bf0;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  cursor: pointer;
  border-radius: 20px;
  padding: 10px 0px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  color: white;
  border: none;
  background-color: #1d9bf0;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function EditTweetForm({
  tweet,
  userId,
  id,
  setEditToggle,
  photo,
}: TweetInfo) {
  const [isLoading, setLoading] = useState(false);
  const [editTweet, setEditTweet] = useState("");
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > 1024 * 1024) {
        alert("1MB 이하의 사진만 업로드 가능합니다.");
        return;
      }
      setEditPhoto(files[0]);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || editTweet === "" || editTweet.length > 180)
      return;

    try {
      setLoading(true);
      // doc(firestore, path, path segment), db에서 수정할 트윗의 참조값을 불러옴
      const docRef = doc(db, "tweets", id);
      await updateDoc(docRef, {
        tweet: editTweet,
        updateAt: Date.now(),
      });
      // 사진을 수정했다면
      if (editPhoto) {
        // 기존 사진이 있을경우 기존 사진을 스토리지에서 삭제함.
        if (photo) {
          const originRef = ref(storage, `tweets/${userId}/${id}`);
          await deleteObject(originRef);
        }
        // 새로운 사진을 기존의 경로에 그대로 업로드한 뒤, 수정할 트윗에 이미지 url 추가. (사진이 없었다면 사진을 추가하는게 됨.)
        const newRef = ref(storage, `tweets/${userId}/${id}`);
        const uploadRes = await uploadBytes(newRef, editPhoto);
        const url = await getDownloadURL(uploadRes.ref);
        await updateDoc(docRef, {
          photo: url,
        });
      }
      setEditToggle(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEditTweet(tweet);
  }, []);
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={editTweet}
        placeholder="What is happning?!"
      />
      <AttachFileButton htmlFor="editfile">
        {editPhoto ? "Photo added ✅" : "Add Photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="editfile"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Update Tweet"}
      />
    </Form>
  );
}
