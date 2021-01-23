function addInfo(valID) {
  let name = "Overview", leaderyes = false;
  let Cdur = 0, Adur = 0, Sdur = 0;
  let CPDuration = 0, APDuration = 0, SPDuration = 0;
  let casRecord = [];
  let groups = [];
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
        Cdur += parseFloat(data.casDuration[0].Cdur);
        Adur += parseFloat(data.casDuration[0].Adur);
        Sdur += parseFloat(data.casDuration[0].Sdur);
        CPDuration = parseFloat(data.casPlan[0].C_CPDuration);
        APDuration = parseFloat(data.casPlan[0].C_APDuration);
        SPDuration = parseFloat(data.casPlan[0].C_SPDuration);
        for (let i = 0; i < data.casRecord.length; i++)
          casRecord.push(data.casRecord[i]);
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
    $("input#text_a_date").removeAttr("disabled", "disabled");
    $("input#txt_active_title").removeAttr("disabled", "disabled");
    $("input#text_du_c").removeAttr("disabled", "disabled");
    $("input#text_du_a").removeAttr("disabled", "disabled");
    $("input#text_du_s").removeAttr("disabled", "disabled");
    $("#text_a_description").removeAttr("disabled", "disabled");
  }
  $("#s_my_group_name").empty();
  $("#s_my_group_name").append(`<a href="#"><i class="fa fa-group"></i>${name}</a>`);
  if (leaderyes != 0)
    $("#d_groupleader_yes").show();
  else
    $("#d_groupleader_yes").hide();
  $("#d_plan_progress").empty();
  let planProgress =
`<div class="progress">
  <div style="width: ${Math.min(100, Cdur / CPDuration * 100)}%;" class="progress-bar progress-bar-danger" role="progressbar">
    <p style="color: black; overflow-x: visible; white-space: nowrap;">C ${Cdur} / ${CPDuration}</p>
  </div>
</div>
<div class="progress">
  <div style="width: ${Math.min(100, Adur / APDuration * 100)}%;" class="progress-bar progress-bar-success" role="progressbar">
  <p style="color: black; overflow-x: visible; white-space: nowrap;">A ${Adur} / ${APDuration}</p>
  </div>
</div>
<div class="progress">
  <div style="width: ${Math.min(100, Sdur / SPDuration * 100)}%;" class="progress-bar progress-bar-info" role="progressbar">
  <p style="color: black; overflow-x: visible; white-space: nowrap;">S ${Sdur} / ${SPDuration}</p>
  </div>
</div>`;
  $("#d_plan_progress").append(planProgress);
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
      addInfo(0);
    },
    error: function() {
      alert("Request failed!");
    }
  });
}

addGroupRecordInfo.addInfo = addInfo;
init();
