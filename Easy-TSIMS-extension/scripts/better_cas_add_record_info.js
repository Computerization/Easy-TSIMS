async function addInfo(valID) {
  let name = "Overview";
  let leaderyes = false;
  const CASdur = [0, 0, 0];
  const CASPdur = [0, 0, 0];
  const casRecords = [];
  const groups = [];
  const recordTime = [0, 0, 0];
  if (valID === 0) {
    const options = document.querySelectorAll("#select_my_group option");
    for (const option of options) groups.push(option.value);
  } else {
    groups.push(valID);
  }
  const fetches = groups.map((groupid) =>
    fetch("php/cas_add_record_info.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupid }),
    })
      .then((data) => {
        name = `${data.groups[0].C_NameC} (${data.groups[0].C_NameE})`;
        leaderyes = data.leaderyes;
        CASdur[0] += parseFloat(data.casDuration[0].Cdur);
        CASdur[1] += parseFloat(data.casDuration[0].Adur);
        CASdur[2] += parseFloat(data.casDuration[0].Sdur);
        CASPdur[0] = parseFloat(data.casPlan[0].C_CPDuration);
        CASPdur[1] = parseFloat(data.casPlan[0].C_APDuration);
        CASPdur[2] = parseFloat(data.casPlan[0].C_SPDuration);
        for (const record of data.casRecord) {
          recordTime[0] += parseFloat(record.C_DurationC);
          recordTime[1] += parseFloat(record.C_DurationA);
          recordTime[2] += parseFloat(record.C_DurationS);
          casRecords.push(record);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      })
  );
  await Promise.all(fetches);
  casRecords.sort((a, b) =>
    a.C_Date.substring(0, 10).localeCompare(b.C_Date.substring(0, 10))
  );
  if (valID === 0) {
    name = "Overview";
    leaderyes = 0;
    for (const id of [
      "text_a_date",
      "txt_active_title",
      "text_du_c",
      "text_du_a",
      "text_du_s",
      "text_a_description",
    ]) {
      document.getElementById(id).setAttribute("disabled", "disabled");
    }
  } else {
    for (const id of [
      "text_a_date",
      "txt_active_title",
      "text_du_c",
      "text_du_a",
      "text_du_s",
      "text_a_description",
    ]) {
      document.getElementById(id).removeAttribute("disabled");
    }
  }
  document.getElementById(
    "s_my_group_name"
  ).innerHTML = `<a href="#"><i class="fa fa-group"></i>${name}</a>`;
  if (leaderyes !== 0) {
    document.getElementById("d_groupleader_yes").style.display = "block";
  } else {
    document.getElementById("d_groupleader_yes").style.display = "none";
  }
  const bars = [
    { type: "C", color: "danger" },
    { type: "A", color: "success" },
    { type: "S", color: "info" },
  ];
  const totalDur = CASdur[0] + CASdur[1] + CASdur[2];
  let planProgress = "";
  planProgress += `<div class="progress">`;
  for (let i = 0; i < 3; i++) {
    planProgress += `<div style="width: ${Math.min(
      (CASdur[i] / totalDur) * 100,
      (CASdur[i] / CASPdur[i]) * 100
    )}%;" class="progress-bar progress-bar-${bars[i].color}" role="progressbar">
      <p style="color: black; overflow-x: visible; white-space: nowrap;">${
        bars[i].type
      } ${CASdur[i]}</p>
    </div>`;
  }
  planProgress += `</div>`;
  for (let i = 0; i < 3; i++) {
    planProgress += `<div class="progress">
      <div style="width: ${Math.min(
        100,
        (CASdur[i] / CASPdur[i]) * 100
      )}%;" class="progress-bar progress-bar-${
      bars[i].color
    }" role="progressbar">
        <p style="color: black; overflow-x: visible; white-space: nowrap;">${
          bars[i].type
        } ${CASdur[i]} / ${CASPdur[i]}</p>
      </div>
    </div>
    `;
  }
  document.getElementById("d_plan_progress").innerHTML = planProgress;
  document.getElementById(
    "timestats"
  ).innerHTML = `<p>Total CAS time in the list below: ${
    Math.round((recordTime[0] + recordTime[1] + recordTime[2]) * 10) / 10
  } =
    <span class="badge badge-important">${
      Math.round(recordTime[0] * 10) / 10
    }</span> +
    <span class="badge badge-success">${
      Math.round(recordTime[1] * 10) / 10
    }</span> +
    <span class="badge badge-info">${Math.round(recordTime[2] * 10) / 10}</span>
  </p>`;
  let casdata = "";
  for (let i = 0; i < casRecords.length; i++) {
    casdata += `<tr id="item-${i}">
      <td class="fc-header-center">${i + 1}</td>
      <td id="Theme-${i}">${casRecords[i].C_Theme}</td>
      <td class="fc-header-center">${casRecords[i].C_Date.substr(0, 10)}</td>
      <td class="fc-header-center"><span class="badge badge-important" id="DurC-${i}">${
      casRecords[i].C_DurationC
    }</span></td>
      <td class="fc-header-center"><span class="badge badge-success" id="DurA-${i}">${
      casRecords[i].C_DurationA
    }</span></td>
      <td class="fc-header-center"><span class="badge badge-info" id="DurS-${i}">${
      casRecords[i].C_DurationS
    }</span></td>
      <td class="fc-header-center">${
        casRecords[i].T_JoinY === 1 ? "是" : "否"
      }</td>
      <td class="fc-header-center">${
        casRecords[i].T_GroupY === 1 ? "是" : "否"
      }</td>
      <td class="fc-header-center">${
        casRecords[i].C_Confirm === 0
          ? "未"
          : casRecords[i].C_Confirm === 1
          ? "已确认"
          : "否"
      }</td>
      <td>
        <div id="Text-${i}" class="reflectionText" style="height: 50px; overflow-y: hidden; cursor: pointer;">
          ${casRecords[i].C_Reflection}
        </div>
      </td>`;
    if (valID !== 0) {
      casdata += ` <td class="fc-header-center">
        <input type="hidden" name="calid" value="${casRecords[i].C_ARecordID}">
        <div class="btn-group btn-group-xs btn-group-solid">
          <button type="button" id="${casRecords[i].C_ARecordID}" class="btn purple">
            <i class="fa fa-trash-o"></i>
            Delete
          </button>
          <button type="button" id="Reuse-${i}" class="btn blue" style="margin-top: 5pt;">
            <i class="fa fa-file-o"></i>
            Reuse
          </button>
        </div>
      </td>
    </tr>`;
    } else {
      casdata += "<td></td></tr>";
    }
  }
  document.getElementById("casabledata").innerHTML = casdata;
  document.querySelector("button.btn.blue").addEventListener("click", (e) => {
    const i = e.target.id.substring(6);
    for (const [inputId, recordId] of [
      ["txt_active_title", `Theme-${i}`],
      ["text_du_c", `DurC-${i}`],
      ["text_du_a", `DurA-${i}`],
      ["text_du_s", `DurS-${i}`],
      ["text_a_description", `Text-${i}`],
    ]) {
      document.getElementById(inputId).value =
        document.getElementById(recordId).innerText;
    }
    document.getElementById("bn_save_records_info").removeAttribute("disabled");
  });
  document.querySelector(".reflectionText").addEventListener("click", (e) => {
    const text = e.target;
    if (text.style.height) {
      text.style.height = "";
      text.style.cursor = "pointer";
    } else {
      text.style.height = "50px";
      text.style.overflowY = "hidden";
      text.style.cursor = "pointer";
    }
  });
  document.getElementById("bn_save_records_info").removeAttribute("disabled");
}

async function init() {
  try {
    const data = await fetch("php/cas_add_mygroups_dropdown.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then((response) => response.json());
    const select = document.getElementById("select_my_group");
    select.innerHTML = "<option value='0'>Overview</option>";
    for (const group of data.nogroups) {
      if (group.C_GroupNo === "014001") {
        select.innerHTML += `<option value='${group.C_GroupsID}'>${group.C_NameC} (${group.C_NameE})</option>`;
      }
    }
    for (const group of data.groups) {
      select.innerHTML += `<option value='${group.C_GroupsID}'>${group.C_GroupNo}_${group.C_NameC} (${group.C_NameE})</option>`;
    }
    const timestats = document.createElement("div");
    timestats.id = "timestats";
    const leftside = document.getElementsByClassName("blog-tag-data")[0];
    const table = document.getElementsByClassName("table-responsive")[0];
    leftside.insertBefore(timestats, table);
    const wordcount = document.createElement("span");
    const textarea = document.getElementById("text_a_description");
    wordcount.style = "margin-right: 10px;";
    wordcount.id = "wordcount";
    wordcount.innerHTML = "当前字数：0";
    textarea.parentNode.insertBefore(wordcount, textarea.nextElementSibling);
    return addInfo(0);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function saveRecords() {
  try {
    const data = await fetch("php/cas_save_record.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupid: document.getElementById("select_my_group").value,
        studentid: document.getElementById("studentid1").value,
        actdate: document.getElementById("text_a_date").value,
        acttitle: document.getElementById("txt_active_title").value,
        durationC: document.getElementById("text_du_c").value,
        durationA: document.getElementById("text_du_a").value,
        durationS: document.getElementById("text_du_s").value,
        actdesc: document.getElementById("text_a_description").value,
        groupy: document.getElementById("chkbox_g_record").checked ? 1 : 0,
        joiny: document.getElementById("chkbox_s_join").checked ? 1 : 0,
      }),
    }).then((response) => response.json());
    if (data.status === "ok") {
      const selValue = document.getElementById("select_my_group").value;
      for (const id of [
        "text_a_date",
        "txt_active_title",
        "text_du_c",
        "text_du_a",
        "text_du_s",
        "text_a_description",
      ]) {
        document.getElementById(id).value = "";
      }
      document.getElementById("chkbox_g_record").checked = false;
      document.getElementById("chkbox_s_join").checked = false;
      addGroupRecordInfo.addInfo(selValue);
    } else {
      alert(data.status);
    }
    document.getElementById("bn_save_records_info").removeAttribute("disabled");
  } catch (error) {
    console.error("Error:", error);
    alert("Save Record failed!");
  }
}

addGroupRecordInfo.addInfo = addInfo;
addGroupRecordInfo.saveRecords = saveRecords;
init();
document.getElementById("text_a_description").addEventListener("keyup", (e) => {
  document.getElementById("wordcount").innerHTML = `当前字数：${
    e.target.value.trim().split(/\s+/g).length
  }`;
});
