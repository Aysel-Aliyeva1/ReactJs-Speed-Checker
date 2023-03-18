import { Fragment, useEffect, useState } from "react";

export function SpeedChecker() {
  const [writingSec, setWritingSec] = useState(0);
  const [content, setContent] = useState("");
  const [content2, setContent2] = useState("");
  const [emoji, setEmoji] = useState("");
  const [startDate, setStartDate] = useState(0);
  const [name, setName] = useState("");
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    let localUserList = localStorage.getItem("userlist");
    let currentUserList = localUserList ? JSON.parse(localUserList) : [];
    setUserList(currentUserList);
  }, []);

  function handleChange(event) {
    const val = event.target.value;

    if (!content || !name) {
      alert("Please add both name and content!");
      return;
    }

    if (val.length === 1) {
      let myStartDate = new Date().getTime();
      console.log("start:", myStartDate);
      setStartDate(myStartDate);
    } else if (val === content) {
      let myEndDate = new Date().getTime();
      let secDifference = (myEndDate - startDate) / 1000;
      let writingSecond = secDifference.toFixed(3);
      setWritingSec(writingSecond);
      let gamer = { name: name, seconds: writingSecond, content: content };
      let localUserList = localStorage.getItem("userlist");
      let currentUserList = localUserList ? JSON.parse(localUserList) : [];

      let findedUser = currentUserList.find((x) => x.name === name && x.content === content);

      if (!findedUser) {
        currentUserList.push(gamer);
      } else if (
        findedUser &&
        Number(findedUser.seconds) > writingSecond &&
        findedUser.content == content
      ) {
        currentUserList = currentUserList.filter(
          (x) => x.name.toLowerCase() !== name.toLowerCase() || x.content.toLowerCase() !== content.toLowerCase()
          
        );
        console.log(currentUserList);
        currentUserList.push(gamer);
      } else if (findedUser.content !== content) {
        currentUserList.push(gamer);
      }
      localStorage.setItem("userlist", JSON.stringify(currentUserList));
      setUserList(currentUserList);

      let result = val.length / secDifference;
      if (result > 4) {
        setEmoji("&#x1F607;");
      } else if (result < 4 && result > 2) {
        setEmoji("&#128577;");
      } else if (result <= 2) {
        setEmoji("&#128557;");
      }
    } else if (!val) {
      setWritingSec(0);
      setEmoji("");
    }

    setContent2(val);
  }

  return (
    <Fragment>
      <div class="container mt-5">
        <h3>Writing speed checker with ReactJs</h3>

        <label for="name" style={{ marginRight: "10px" }}>
          Name:
        </label>
        <input
          onChange={(event) => setName(event.target.value)}
          value={name}
          id="name"
        />

        <div className="row mt-5">
          <div className="col-5">
            <p>
              Content <span>({content.length})</span> (
              <span style={{ color: "gray" }}>You can change the text</span>)
            </p>
            <input
              className="myInput"
              onChange={(event) => setContent(event.target.value)}
              value={content}
              id="content"
            />
          </div>

          <div className="col-1"></div>

          <div className="col-5">
            <p>Write here</p>
            <input
              className="myInput"
              onChange={(event) => handleChange(event)}
              value={content2}
              id="content2"
            />
          </div>
        </div>
        {Boolean(writingSec) && (
          <p>
            Speed Time: {writingSec} sec{" "}
            <span dangerouslySetInnerHTML={{ __html: emoji }} />
          </p>
        )}

        <table>
          <tr>
            <th>Name:</th>
            <th>Seconds:</th>
            <th>Content:</th>
          </tr>
          {userList.sort((a, b) => Number(a.seconds) - Number(b.seconds)).map((x, i) => (
            <tr key={i}>
              <td>{x.name}</td>
              <td>{x.seconds}</td>
              <td>{x.content}</td>
            </tr>
          ))}
        </table>
      </div>
    </Fragment>
  );
}
