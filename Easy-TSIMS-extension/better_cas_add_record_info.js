function addInfo(valID) {
  let name = "Overview", leaderyes = false;
  let CASdur = [0, 0, 0];
  let CASPdur = [0, 0, 0];
  let casRecord = [];
  let groups = [];
  let recordTime = [0, 0, 0];
  if (valID == 0) {
    let options = $("#select_my_group").children("option");
    for (let i = 1; i < options.length; i++)
      groups.push(options[i].value);
  } else {
    groups.push(valID);
  }
  for (let i = 0; i < groups.length; i++) {
    $.ajax({
      url: "php/cas_add_record_info.php",
      dataType: "json",
      type: "post",
      async: false,
      data: {
        groupid: groups[i]
      },
      success: function(data) {
        name = `${data.groups[0].C_NameC} (${data.groups[0].C_NameE})`;
        leaderyes = data.leaderyes;
        CASdur[0] += parseFloat(data.casDuration[0].Cdur);
        CASdur[1] += parseFloat(data.casDuration[0].Adur);
        CASdur[2] += parseFloat(data.casDuration[0].Sdur);
        CASPdur[0] = parseFloat(data.casPlan[0].C_CPDuration);
        CASPdur[1] = parseFloat(data.casPlan[0].C_APDuration);
        CASPdur[2] = parseFloat(data.casPlan[0].C_SPDuration);
        for (let i = 0; i < data.casRecord.length; i++) {
          recordTime[0] += parseFloat(data.casRecord[i].C_DurationC);
          recordTime[1] += parseFloat(data.casRecord[i].C_DurationA);
          recordTime[2] += parseFloat(data.casRecord[i].C_DurationS);
          casRecord.push(data.casRecord[i]);
        }
      },
      error: function() {
        alert("Request failed!");
      }
    });
  }
  if (valID == 0) {
    name = "Overview";
    leaderyes = 0;
    $("input#text_a_date").attr("disabled", "disabled");
    $("input#txt_active_title").attr("disabled", "disabled");
    $("input#text_du_c").attr("disabled", "disabled");
    $("input#text_du_a").attr("disabled", "disabled");
    $("input#text_du_s").attr("disabled", "disabled");
    $("#text_a_description").attr("disabled", "disabled");
  } else {
    $("input#text_a_date").removeAttr("disabled");
    $("input#txt_active_title").removeAttr("disabled");
    $("input#text_du_c").removeAttr("disabled");
    $("input#text_du_a").removeAttr("disabled");
    $("input#text_du_s").removeAttr("disabled");
    $("#text_a_description").removeAttr("disabled");
  }
  $("#s_my_group_name").empty();
  $("#s_my_group_name").append(`<a href="#"><i class="fa fa-group"></i>${name}</a>`);
  if (leaderyes != 0)
    $("#d_groupleader_yes").show();
  else
    $("#d_groupleader_yes").hide();
  $("#d_plan_progress").empty();
  let planProgress = ""
  let bars = [{type: "C", color: "danger"}, {type: "S", color: "success"}, {type: "S", color: "info"}]
  for (let i = 0; i < 3; i++) {
    planProgress +=
`<div class="progress">
  <div style="width: ${Math.min(100, CASdur[i] / CASPdur[i] * 100)}%;" class="progress-bar progress-bar-${bars[i].color}" role="progressbar">
    <p style="color: black; overflow-x: visible; white-space: nowrap;">${bars[i].type} ${CASdur[i]} / ${CASPdur[i]}</p>
  </div>
</div>
`;
  }
  $("#d_plan_progress").append(planProgress);
  $("#timestats").empty();
  $("#timestats").append(`Total CAS time in the list below: <span class="badge badge-important">${recordTime[0]}</span>
  <span class="badge badge-success">${recordTime[1]}</span>
  <span class="badge badge-info">${recordTime[2]}</span>`);
  $("#castabledata").empty();
  let casdata = "";
  for (let i = 0; i < casRecord.length; i++) {
    casdata +=
`<tr id="item-${i}">
  <td class="fc-header-center">${i + 1}</td>
  <td id="Theme-${i}">${casRecord[i].C_Theme}</td>
  <td class="fc-header-center">${casRecord[i].C_Date.substr(0,10)}</td>
  <td class="fc-header-center"><span class="badge badge-important" id="DurC-${i}">${casRecord[i].C_DurationC}</span></td>
  <td class="fc-header-center"><span class="badge badge-success" id="DurA-${i}">${casRecord[i].C_DurationA}</span></td>
  <td class="fc-header-center"><span class="badge badge-info" id="DurS-${i}">${casRecord[i].C_DurationS}</span></td>
  <td class="fc-header-center">${casRecord[i].T_JoinY == 1 ? "是" : "否"}</td>
  <td class="fc-header-center">${casRecord[i].T_GroupY == 1 ? "是" : "否"}</td>
  <td class="fc-header-center">${casRecord[i].C_Confirm == 2 ? "否" : "未"}</td>
  <td>
    <div id="Text-${i}" class="reflectionText" style="height: 50px; overflow-y: hidden; cursor: pointer;">
      ${casRecord[i].C_Reflection}
    </div>
  </td>`;
    if (valID != 0) {
      casdata +=
`  <td class="fc-header-center">
    <input type="hidden" name="calid" value="${casRecord[i].C_ARecordID}">
    <div class="btn-group btn-group-xs btn-group-solid">
      <button type="button" id="${casRecord[i].C_ARecordID}" class="btn purple">
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
  $("#castabledata").append(casdata);
  $("button.btn.blue").click(function() {
    let i = $(this).attr("id").substr(6);
    $("input#txt_active_title").val($(`#Theme-${i}`)[0].innerText);
    $("input#text_du_c").val($(`#DurC-${i}`)[0].innerText);
    $("input#text_du_a").val($(`#DurA-${i}`)[0].innerText);
    $("input#text_du_s").val($(`#DurS-${i}`)[0].innerText);
    $("#text_a_description").val($(`#Text-${i}`)[0].innerText);
    $("#bn_save_records_info").removeAttr("disabled");
  });
  $(".reflectionText").click(function() {
    if ($(this).attr("style").indexOf("height") >= 0)
      $(this).attr("style", "cursor: pointer;");
    else
      $(this).attr("style", "height: 50px; overflow-y: hidden; cursor: pointer;");
  })
  $("#bn_save_records_info").removeAttr("disabled");
}

function init() {
  $.ajax({
    url: 'php/cas_add_mygroups_dropdown.php',
    dataType: 'json',
    type: 'post',
    data: {},
    success: function(data) {
      $("#select_my_group").empty();
      $("#select_my_group").append("<option value='0'>Overview</option>");
      for (let i = 0; i < data.nogroups.length; i++) {
        if (data.nogroups[i].C_GroupNo == '014001') {
          $("#select_my_group").append(`<option value='${data.nogroups[i].C_GroupsID}'>${data.nogroups[i].C_NameC} (${data.nogroups[i].C_NameE})</option>`);
        }
      }
      for (let i = 0; i < data.groups.length; i++) {
        $("#select_my_group").append(`<option value='${data.groups[i].C_GroupsID}'>${data.groups[i].C_GroupNo}_${data.groups[i].C_NameC} (${data.groups[i].C_NameE})</option>`);
      }
      let timestats = document.createElement("div");
      timestats.id = "timestats";
      let leftside = document.getElementsByClassName("blog-tag-data")[0];
      let table = document.getElementsByClassName("table-responsive")[0];
      leftside.insertBefore(timestats, table);
      addInfo(0);
    },
    error: function() {
      alert("Request failed!");
    }
  });
}

function saveRecords() {
  $.ajax({
    url: "php/cas_save_record.php",
    dataType: "json",
    type: "post",
    data: {
      groupid:  function(){return $('#select_my_group').children('option:selected').val();},
      studentid:function(){return $('#studentid1').val();},
      actdate:  function(){return $("input#text_a_date").val();},
      acttitle: function(){return $("input#txt_active_title").val();},
      durationC:function(){return $("input#text_du_c").val();},
      durationA:function(){return $("input#text_du_a").val();},
      durationS:function(){return $("input#text_du_s").val();},
      actdesc:  function(){return $("#text_a_description").val();},
      groupy:   $("#chkbox_g_record").attr("checked") == "checked" ? 1 : 0,
      joiny:    $("#chkbox_s_join").attr("checked") == "checked" ? 1 : 0
    },
    success: function(data) {
      if (data.status == 'ok') {
        var selValue = $('#select_my_group').children('option:selected').val();
        $("input#text_a_date").val("");
        $("input#txt_active_title").val("");
        $("input#text_du_c").val("");
        $("input#text_du_a").val("");
        $("input#text_du_s").val("");
        $("#text_a_description").val("");
        $("#chkbox_g_record").attr("checked", false);
        $("#chkbox_s_join").attr("checked", false);
        addGroupRecordInfo.addInfo(selValue);
      } else {
        alert(data.status);
      }
      $("#bn_save_records_info").removeAttr("disabled");
    },
    error: function() {
        alert("Save Record failed!");
    }
  });
}

addGroupRecordInfo.addInfo = addInfo;
addGroupRecordInfo.saveRecords = saveRecords;
init();
