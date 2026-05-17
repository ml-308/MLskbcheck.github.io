(function() {
        // ---------- 模拟用户数据库 (前端演示存储) ----------
        // 实际生产环境应使用后端接口, 这里仅做登录演示逻辑。
        // 预留注册功能意味着虽然界面有注册占位，但无法实际新增账号。
        // 同时系统内置两个可用账号展示登录流程。
        const VALID_USERS = new Map();
        // 初始化预设账号 (安全起见，仅演示校验)
        VALID_USERS.set('admin@demo.com', {
            password: '123456',
            name: '管理员',
            role: 'admin'
        });
        VALID_USERS.set('user@test.com', {
            password: 'password',
            name: '普通成员',
            role: 'member'
        });
        // 额外支持用户名形式的登录 (例如 admin)
        VALID_USERS.set('admin', {
            password: '123456',
            name: '管理员',
            role: 'admin'
        });
        // 注意: 完全预留注册扩展点 —— 但不会开放注册执行逻辑

        // DOM 元素
        const loginForm = document.getElementById('loginForm');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const toastMsgDiv = document.getElementById('messageToast');
        const registerPlaceholderBtn = document.getElementById('registerBtnPlaceholder');

        // 辅助函数: 显示临时提示 (自动3秒消失，且可覆盖)
        let toastTimeout = null;
        function showMessage(message, isError = true) {
            if (toastTimeout) clearTimeout(toastTimeout);
            toastMsgDiv.textContent = message;
            toastMsgDiv.className = 'toast-msg show';
            // 根据类型微调背景 (错误红/成功绿)
            if (!isError) {
                toastMsgDiv.style.background = '#e0f2e9';
                toastMsgDiv.style.color = '#166534';
                toastMsgDiv.style.borderLeftColor = '#22c55e';
            } else {
                toastMsgDiv.style.background = '#fee2e2';
                toastMsgDiv.style.color = '#991b1b';
                toastMsgDiv.style.borderLeftColor = '#f87171';
            }
            toastTimeout = setTimeout(() => {
                toastMsgDiv.classList.remove('show');
                toastTimeout = null;
            }, 2800);
        }

        // 清除错误样式辅助
        function clearFieldErrors() {
            const inputs = [usernameInput, passwordInput];
            inputs.forEach(inp => {
                inp.style.borderColor = '';
                inp.style.boxShadow = '';
            });
        }

        function highlightField(field) {
            field.style.borderColor = '#f97316';
            field.style.boxShadow = '0 0 0 2px rgba(249,115,22,0.2)';
        }

        // 执行登录验证 (核心逻辑)
        function performLogin(event) {
            // 阻止表单默认提交与页面刷新
            if (event) event.preventDefault();

            clearFieldErrors();
            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            // 基础非空校验
            if (!username) {
                showMessage('❌ 请输入用户名或邮箱', true);
                highlightField(usernameInput);
                usernameInput.focus();
                return false;
            }
            if (!password) {
                showMessage('❌ 密码不能为空', true);
                highlightField(passwordInput);
                passwordInput.focus();
                return false;
            }

            // 查找用户 (预留未来注册接口: 若注册功能开放会向此 Map 添加数据，但目前不允许)
            const userRecord = VALID_USERS.get(username);
            if (!userRecord) {
                // 用户名不存在时，给予通用提示 (友好，不暴露具体原因)
                showMessage('登录失败，账号或密码错误', true);
                highlightField(usernameInput);
                highlightField(passwordInput);
                return false;
            }

            // 密码比对
            if (userRecord.password !== password) {
                showMessage('登录失败，账号或密码错误', true);
                highlightField(passwordInput);
                return false;
            }

            // 登录成功逻辑
            showMessage(`✅ 欢迎回来，${userRecord.name}！登录成功，正在跳转...`, false);
            // 模拟登录成功后续: 可储存token/重定向
            // 由于是纯前端演示，延迟1秒弹出控制台信息 & 轻提示
            setTimeout(() => {
                // 实际应用中，此处可跳转仪表盘页面，或者显示更多功能。
                // 为了直观，展示alert并重置表单(可选)
                alert(`登录成功！\n角色：${userRecord.role}\n用户：${userRecord.name}\n\n(演示模式，未开放注册，注册接口已预留但不启用)`);
                // 可选重置表单或保持状态，为了体验不清空，但模拟登录后行为
                // 可以根据需求重定向: window.location.href = "/dashboard";
                console.info(`[Login Success] ${username} 已登录，注册功能预留但未开放接口。`);
            }, 200);
            return true;
        }

        // ---------- 预留注册功能 · 展示模块 (不真正执行注册，仅提醒) ----------
        // 完全模拟预留但不开放: 注册按钮点击时，弹出无法注册的提示。
        function onRegisterReserved() {
            // 展示优雅提醒，表明注册功能处于预留阶段，并未开放
            showMessage('📌 注册功能目前仅作为预留接口，暂未开放。敬请期待后续版本。', true);
            // 附加控制台友好提示，预留扩展点 (开发者可在此以后接入真实注册逻辑)
            console.warn('[Reserved Feature] 注册功能按钮已触发，但系统当前未开放注册。未来可在此扩展注册逻辑（例如调用后端API）');
            // 这里可以添加任何未来扩展代码的占位注释:
            // if (config.allowRegistration) { ... }
        }

        // 为注册按钮绑定预留事件
        if (registerPlaceholderBtn) {
            registerPlaceholderBtn.addEventListener('click', onRegisterReserved);
        }

        // 为登录表单绑定提交事件
        if (loginForm) {
            loginForm.addEventListener('submit', performLogin);
        }

        // 额外增强输入体验: 按回车可直接触发登录 (由表单submit自然处理)
        // 并且为演示，登录按钮手动兜底
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            // 防止按钮被多次绑定，直接使用表单的submit行为即可，但为防止某些嵌套问题，保留额外点击逻辑
            loginBtn.addEventListener('click', (e) => {
                // 如果事件由按钮触发表单submit，避免重复调用performLogin (因为表单submit会触发)
                // 但浏览器中按钮若为type="submit"，会触发表单submit，而我们已经监听submit，所以不再重复调用。
                // 但万一未来修改type, 这里不做重复调用。为了让逻辑严谨，若没有submit触发手动执行
                if (!loginForm.dispatchEvent) return;
                // 确保表单校验触发 (无需额外调用，默认submit完美)
            });
        }

        // 可选小特性：增加实时演示友好提示焦点
        console.info('✅ 登录模块已加载 | 预留注册功能（按钮不可注册，仅展示预留接口）');

        // 扩展：演示环境中为方便测试，可在控制台输出预留注册的扩展说明
        // 同时为了说明代码具备注册接口扩展性，定义一个全局预留注册方法（但不暴露给用户界面）
        window.__reservedRegistrationAPI = {
            // 虚拟函数，展示未来注册逻辑需要实现的规范接口示例
            futureRegister: (email, password, nickname) => {
                console.warn('[预留扩展点] 注册API尚未连接后端，此处仅展示预留设计结构。参数: ', { email, password, nickname });
                return { success: false, message: '注册功能暂未开放，预留接口已定义' };
            }
        };
        // 代码注释清晰表明将来开发者可以启用注册模块: 
        // 1. 取消registerBtnPlaceholder的disabled样式; 2. 替换onRegisterReserved为真实注册逻辑
        // 3. 添加向 VALID_USERS 提交新用户的后端同步请求。目前纯前端模拟MAP仅供演示登录校验。
        // 预留但不影响主要登录体验。
    })();