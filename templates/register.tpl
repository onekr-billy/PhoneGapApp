<form id="frmReg" action="login.aspx">
        <div data-role="fieldcontain" class="ui-hide-label">
            <fieldset data-role="controlgroup">
                <label for="register_email">
                    邮箱地址</label>
                <input type="text" id="register_email" name="email" class="required email" placeholder="请填写有效的Email地址"
                    value="" />
                <span id="register_ErroMesg" class="error" generated="true" style="display:none"></span>
            </fieldset>
        </div>
        <div data-role="fieldcontain" class="ui-hide-label">
            <fieldset data-role="controlgroup">
                <label for="register_password">
                    密码</label>
                <input type="password" id="register_password" name="password" class="required" placeholder="请输入密码,为6-20位英文字母、字符或数字"
                    value="" />
            </fieldset>
        </div>
        <div data-role="fieldcontain" class="ui-hide-label">
            <fieldset data-role="controlgroup">
                <label for="register_confirm_password">
                    确认密码</label>
                <input type="password" id="register_confirm_password" name="confirm_password" class="required"
                    placeholder="请输入确认密码" value="" />
            </fieldset>
        </div>
        <div data-role="fieldcontain" class="ui-hide-label">
            <fieldset data-role="controlgroup">
                <label for="mobile">
                    手机号码</label>
                <input type="text" id="register_mobile" name="mobile" class="required" placeholder="请输入手机号用于接收母婴之家优惠礼券"
                    value="" />
            </fieldset>
        </div>
        <div data-role="fieldcontain">
            <fieldset data-role="controlgroup" data-type="horizontal">
                <legend>宝宝生日或预产期</legend>
                <label for="select-choice-year">
                    年</label>
                <select name="year" id="select-choice-year" class="required">
                </select>
                <label for="select-choice-month">
                    月</label>
                <select name="month" id="select-choice-month" class="required">
                </select>
                <label for="select-choice-day">
                    日</label>
                <select name="day" id="select-choice-day" class="required">
                </select>
                <div class="error"></div>
            </fieldset>
        </div>
        <div data-role="fieldcontain">
        <label id="checkbox_tiao" for="checkbox_agree">
                阅读并同意"母婴之家"网站</label>
            <input type="checkbox" name="checkbox_agree" id="checkbox_agree" class="custom" data-mini="true" />
            
            <a id="userpolicy" href="userpolicy.aspx" >查看母婴之家用户协议</a>
        </div>
        <input data-theme="b" value="注册" type="submit" id="btn_register" />
        </form>