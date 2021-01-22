addGroupRecordInfo.addInfo = function (valID) {    
  $.ajax({
    url: "php/cas_add_record_info.php",
    dataType: "json",
    type: "post",
    data:{
      groupid: valID
    },
    success: function(data) {
      $("#s_my_group_name").empty();
      let groupName = `<a href="#"><i class="fa fa-group"></i>${data.groups[0].C_NameC}(${data.groups[0].C_NameE})</a>`;
      $("#s_my_group_name").append(groupName);
      if (data.leaderyes != 0)
        $("#d_groupleader_yes").show();
      else
        $("#d_groupleader_yes").hide();
      $("#d_plan_progress").empty();
      let planProgress =
`<div class="progress">
  <div style="width: ${data.status == "ok" ? Math.min(100, (data.casDuration[0].Cdur / data.casPlan[0].C_CPDuration) * 100) : 0}%;" class="progress-bar progress-bar-danger" role="progressbar">
    <p>C ${data.status == "ok" ? Math.min(100, (data.casDuration[0].Cdur / data.casPlan[0].C_CPDuration) * 100) : 0}%</p>
  </div>
</div>
<div class="progress">
  <div style="width: ${data.status == "ok" ? Math.min(100, (data.casDuration[0].Adur / data.casPlan[0].C_APDuration) * 100) : 0}%;" class="progress-bar progress-bar-success" role="progressbar">
    <p>A ${data.status == "ok" ? Math.min(100, (data.casDuration[0].Adur / data.casPlan[0].C_APDuration) * 100) : 0}%</p>
  </div>
</div>
<div class="progress">
  <div style="width: ${data.status == "ok" ? Math.min(100, (data.casDuration[0].Sdur / data.casPlan[0].C_SPDuration) * 100) : 0}%;" class="progress-bar progress-bar-info" role="progressbar">
    <p>S ${data.status == "ok" ? Math.min(100, (data.casDuration[0].Sdur / data.casPlan[0].C_SPDuration) * 100) : 0}%</p>
  </div>
</div>`;
      $("#d_plan_progress").append(planProgress);
      $("#castabledata").empty();
      let casdata = "";
      for (let i = 0; i < data.casRecord.length; i++) {
        casdata +=
`<tr id="item-${i}">
  <td class="fc-header-center">${i + 1}</td>
  <td id="Theme-${i}">${data.casRecord[i].C_Theme}</td>
  <td class="fc-header-center">${data.casRecord[i].C_Date.substr(0,10)}</td>
  <td class="fc-header-center"><span class="badge badge-important" id="DurC-${i}">${data.casRecord[i].C_DurationC}</span></td>
  <td class="fc-header-center"><span class="badge badge-success" id="DurA-${i}">${data.casRecord[i].C_DurationA}</span></td>
  <td class="fc-header-center"><span class="badge badge-info" id="DurS-${i}">${data.casRecord[i].C_DurationS}</span></td>
  <td class="fc-header-center">${data.casRecord[i].T_JoinY == 1 ? "是" : "否"}</td>
  <td class="fc-header-center">${data.casRecord[i].T_GroupY == 1 ? "是" : "否"}</td>
  <td class="fc-header-center">${data.casRecord[i].C_Confirm == 2 ? "否" : "未"}</td>
  <td>
    <div id="Text-${i}" class="reflectionText" style="height: 50px; overflow-y: hidden; cursor: pointer;">
      ${data.casRecord[i].C_Reflection}
    </div>
  </td>
  <td class="fc-header-center">
    <input type="hidden" name="calid" value="${data.casRecord[i].C_ARecordID}">
    <div class="btn-group btn-group-xs btn-group-solid">
      <button type="button" id="${data.casRecord[i].C_ARecordID}" class="btn purple">
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
    },
    error: function() {
      alert("Request failed!");
    }
  });
};
