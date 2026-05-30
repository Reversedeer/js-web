document.addEventListener('DOMContentLoaded', function () {
  restoreTheme();
  initNav();
  initClock();
  initCountdown();
  initCarousel();
  initTabs();
  initTodoList();
  initCourseTable();
  initColorPicker();
  initLoginForm();
  initRegisterForm();
});

function initNav() {
  var links = document.querySelectorAll('.nav-links a');
  var currentPath = window.location.pathname;

  for (var i = 0; i < links.length; i++) {
    if (currentPath.indexOf(links[i].getAttribute('href')) !== -1 ||
        (currentPath === '/' && links[i].getAttribute('href') === 'index.html')) {
      links[i].classList.add('active');
    }
  }

  updateAuthNav();
}

function updateAuthNav() {
  var navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  var currentUser = JSON.parse(localStorage.getItem('zhiyuan_currentUser') || 'null');

  if (currentUser) {
    navLinks.innerHTML = '<li><a href="index.html">首页</a></li>' +
      '<li><a href="about.html">关于</a></li>' +
      '<li><a href="https://github.com/Reversedeer/js-web" target="_blank">GitHub</a></li>' +
      '<li><span class="nav-user">' + currentUser.username + '</span></li>' +
      '<li><a href="javascript:void(0)" class="nav-logout" id="btn-logout">退出登录</a></li>';

    var logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('zhiyuan_currentUser');
        showToast('已退出登录，期待你的下次学习！', 'success');
        setTimeout(function () {
          window.location.reload();
        }, 1200);
      });
    }

    initNavHighlight();
  }
}

function initNavHighlight() {
  var links = document.querySelectorAll('.nav-links a');
  var currentPath = window.location.pathname;
  for (var i = 0; i < links.length; i++) {
    links[i].classList.remove('active');
    if (currentPath.indexOf(links[i].getAttribute('href')) !== -1 ||
        (currentPath === '/' && links[i].getAttribute('href') === 'index.html')) {
      links[i].classList.add('active');
    }
  }
}

function initClock() {
  var clockEl = document.getElementById('clock-time');
  var dateEl = document.getElementById('clock-date');
  if (!clockEl) return;

  function updateClock() {
    var now = new Date();
    var h = addZero(now.getHours());
    var m = addZero(now.getMinutes());
    var s = addZero(now.getSeconds());
    clockEl.textContent = h + ':' + m + ':' + s;

    var weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    var weekStr;
    switch (now.getDay()) {
      case 0: weekStr = weekDays[0]; break;
      case 1: weekStr = weekDays[1]; break;
      case 2: weekStr = weekDays[2]; break;
      case 3: weekStr = weekDays[3]; break;
      case 4: weekStr = weekDays[4]; break;
      case 5: weekStr = weekDays[5]; break;
      case 6: weekStr = weekDays[6]; break;
      default: weekStr = '';
    }

    dateEl.textContent = now.getFullYear() + '年' +
      (now.getMonth() + 1) + '月' +
      now.getDate() + '日 星期' + weekStr;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

function addZero(num) {
  return num < 10 ? '0' + num : '' + num;
}

function initCountdown() {
  var dayEl = document.getElementById('countdown-day');
  var hourEl = document.getElementById('countdown-hour');
  var minEl = document.getElementById('countdown-min');
  var secEl = document.getElementById('countdown-sec');
  if (!dayEl) return;

  var targetDate = new Date(2026, 6, 10, 23, 59, 59);

  function tick() {
    var now = new Date();
    var diff = targetDate - now;

    if (diff <= 0) {
      dayEl.textContent = '00';
      hourEl.textContent = '00';
      minEl.textContent = '00';
      secEl.textContent = '00';
      showToast('期末考试时间已到，祝考试顺利！', 'success');
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var secs = Math.floor((diff % (1000 * 60)) / 1000);

    dayEl.textContent = addZero(days);
    hourEl.textContent = addZero(hours);
    minEl.textContent = addZero(mins);
    secEl.textContent = addZero(secs);
  }

  tick();
  setInterval(tick, 1000);
}

function initCarousel() {
  var slides = document.querySelectorAll('.carousel .slide');
  var dots = document.querySelectorAll('.carousel .carousel-dots .dot');
  var prevBtn = document.querySelector('.carousel .prev');
  var nextBtn = document.querySelector('.carousel .next');
  if (slides.length === 0) return;

  var currentIndex = 0;
  var totalSlides = slides.length;

  function goToSlide(index) {
    if (index < 0) {
      index = totalSlides - 1;
    } else if (index >= totalSlides) {
      index = 0;
    }

    for (var i = 0; i < slides.length; i++) {
      slides[i].classList.remove('active');
      if (dots[i]) dots[i].classList.remove('active');
    }

    slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentIndex = index;
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  if (dots.length > 0) {
    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        goToSlide(idx);
      });
    });
  }

  setInterval(nextSlide, 3500);
}

function initTabs() {
  var tabBtns = document.querySelectorAll('.tabs .tab-nav button');
  var tabPanels = document.querySelectorAll('.tabs .tab-panel');

  if (tabBtns.length === 0) return;

  function switchTab(index) {
    for (var i = 0; i < tabBtns.length; i++) {
      tabBtns[i].classList.remove('active');
      if (tabPanels[i]) tabPanels[i].classList.remove('active');
    }
    tabBtns[index].classList.add('active');
    if (tabPanels[index]) tabPanels[index].classList.add('active');
  }

  for (var j = 0; j < tabBtns.length; j++) {
    (function (idx) {
      tabBtns[idx].addEventListener('click', function () {
        switchTab(idx);
      });
    })(j);
  }
}

var todoList = [];

function initTodoList() {
  var input = document.getElementById('todo-input');
  var addBtn = document.getElementById('todo-add-btn');
  var listEl = document.getElementById('todo-list');

  if (!input || !addBtn || !listEl) return;

  addBtn.addEventListener('click', function () {
    addTodo();
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      addTodo();
    }
  });

  listEl.addEventListener('click', function (e) {
    var target = e.target;

    if (target.classList.contains('del-btn')) {
      var index = parseInt(target.getAttribute('data-index'));
      deleteTodo(index);
    } else if (target.tagName === 'LI' || target.closest('li')) {
      var li = target.tagName === 'LI' ? target : target.closest('li');
      var idx = parseInt(li.getAttribute('data-index'));
      toggleTodo(idx);
    }
  });

  renderTodoList();
}

function addTodo() {
  var input = document.getElementById('todo-input');
  var text = input.value.trim();

  if (text === '') {
    showToast('请输入学习计划内容', 'error');
    return;
  }
  if (text.length > 50) {
    showToast('计划内容不能超过50个字符', 'error');
    return;
  }

  todoList.push({ text: text, completed: false });
  input.value = '';
  input.focus();
  renderTodoList();
}

function deleteTodo(index) {
  todoList.splice(index, 1);
  renderTodoList();
}

function toggleTodo(index) {
  if (todoList[index]) {
    todoList[index].completed = !todoList[index].completed;
    renderTodoList();
  }
}

function renderTodoList() {
  var listEl = document.getElementById('todo-list');
  if (!listEl) return;

  listEl.innerHTML = '';

  if (todoList.length === 0) {
    var emptyDiv = document.createElement('div');
    emptyDiv.className = 'todo-empty';
    emptyDiv.textContent = '暂无学习计划，快来制定你的学习目标吧~';
    listEl.appendChild(emptyDiv);
    return;
  }

  for (var i = 0; i < todoList.length; i++) {
    var item = todoList[i];

    var li = document.createElement('li');
    li.setAttribute('data-index', i);

    if (item.completed) {
      li.classList.add('completed');
    }

    var span = document.createElement('span');
    span.textContent = (i + 1) + '. ' + item.text;

    var delBtn = document.createElement('button');
    delBtn.className = 'del-btn';
    delBtn.setAttribute('data-index', i);
    delBtn.textContent = '完成';

    li.appendChild(span);
    li.appendChild(delBtn);
    listEl.appendChild(li);
  }
}

function initCourseTable() {
  var tbody = document.getElementById('user-tbody');
  if (!tbody) return;

  var courses = [
    { name: 'Web前端开发基础', hours: 48, level: 'beginner', teacher: '张老师' },
    { name: 'JavaScript程序设计', hours: 64, level: 'intermediate', teacher: '李老师' },
    { name: 'TypeScript程序设计', hours: 56, level: 'advanced', teacher: '王老师' },
    { name: '数据库原理与应用', hours: 40, level: 'intermediate', teacher: '赵老师' },
    { name: '计算机网络基础', hours: 32, level: 'beginner', teacher: '孙老师' }
  ];

  var levelMap = { beginner: '入门', intermediate: '进阶', advanced: '高级' };

  function renderCourses() {
    tbody.innerHTML = '';

    courses.forEach(function (course) {
      var tr = document.createElement('tr');

      var tdName = document.createElement('td');
      tdName.textContent = course.name;

      var tdHours = document.createElement('td');
      tdHours.textContent = course.hours + ' 课时';

      var tdLevel = document.createElement('td');
      var badge = document.createElement('span');
      badge.className = 'level-badge level-' + course.level;
      badge.textContent = levelMap[course.level] || '未知';
      tdLevel.appendChild(badge);

      var tdTeacher = document.createElement('td');
      tdTeacher.textContent = course.teacher;

      tr.appendChild(tdName);
      tr.appendChild(tdHours);
      tr.appendChild(tdLevel);
      tr.appendChild(tdTeacher);
      tbody.appendChild(tr);
    });
  }

  renderCourses();
}

var themePalettes = {
  '#f5f7fa': { dark: '#1a3a5c', primary: '#2980b9', accent: '#3498db' },
  '#fef9e7': { dark: '#935116', primary: '#e67e22', accent: '#f39c12' },
  '#eaf2f8': { dark: '#1a5276', primary: '#2471a3', accent: '#5dade2' },
  '#fdedec': { dark: '#922b21', primary: '#c0392b', accent: '#e74c3c' },
  '#e8f8f5': { dark: '#145a32', primary: '#1e8449', accent: '#27ae60' },
  '#f4ecf7': { dark: '#512e5f', primary: '#7d3c98', accent: '#8e44ad' }
};

function applyTheme(bgColor) {
  var palette = themePalettes[bgColor] || themePalettes['#f5f7fa'];
  var root = document.documentElement;

  document.body.style.backgroundColor = bgColor;
  root.style.setProperty('--primary-dark', palette.dark);
  root.style.setProperty('--primary', palette.primary);
  root.style.setProperty('--accent', palette.accent);
  root.style.setProperty('--nav-gradient', 'linear-gradient(135deg, ' + palette.dark + ' 0%, ' + palette.primary + ' 100%)');
  root.style.setProperty('--btn-gradient', 'linear-gradient(135deg, ' + palette.dark + ', ' + palette.primary + ')');
}

function restoreTheme() {
  var savedColor = localStorage.getItem('theme-color');
  if (savedColor) {
    applyTheme(savedColor);
  }
}

function initColorPicker() {
  var colorBtns = document.querySelectorAll('.color-grid .color-btn');
  if (colorBtns.length === 0) return;

  var savedColor = localStorage.getItem('theme-color');
  if (savedColor) {
    var k = 0;
    while (k < colorBtns.length) {
      if (colorBtns[k].getAttribute('data-color') === savedColor) {
        colorBtns[k].classList.add('active');
        break;
      }
      k++;
    }
  }

  for (var i = 0; i < colorBtns.length; i++) {
    colorBtns[i].addEventListener('click', function () {
      var color = this.getAttribute('data-color');

      for (var j = 0; j < colorBtns.length; j++) {
        colorBtns[j].classList.remove('active');
      }
      this.classList.add('active');

      localStorage.setItem('theme-color', color);
      applyTheme(color);
    });
  }
}

function showToast(msg, type) {
  var toast = document.createElement('div');
  toast.className = 'toast ' + (type || 'success');
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(function () {
    toast.remove();
  }, 2500);
}

function initLoginForm() {
  var form = document.getElementById('login-form');
  if (!form) return;

  var username = document.getElementById('login-username');
  var password = document.getElementById('login-password');

  username.addEventListener('blur', function () {
    validateUsername(username);
  });

  password.addEventListener('blur', function () {
    validatePassword(password);
  });

  username.addEventListener('input', function () {
    clearError(username);
  });

  password.addEventListener('input', function () {
    clearError(password);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var isValid = true;

    if (!validateUsername(username)) isValid = false;
    if (!validatePassword(password)) isValid = false;

    if (isValid) {
      var users = JSON.parse(localStorage.getItem('zhiyuan_users') || '[]');
      var found = false;
      var currentUser = null;

      var i = 0;
      while (i < users.length) {
        if (users[i].username === username.value && users[i].password === password.value) {
          found = true;
          currentUser = users[i];
          break;
        }
        i++;
      }

      if (found) {
        localStorage.setItem('zhiyuan_currentUser', JSON.stringify(currentUser));
        showToast('登录成功！欢迎回来，' + currentUser.username + '同学！', 'success');
        setTimeout(function () {
          window.location.href = 'index.html';
        }, 1500);
      } else {
        showToast('用户名或密码错误，请重试！', 'error');
      }
    }
  });
}

function validateUsername(input) {
  var val = input.value.trim();
  var errorEl = input.nextElementSibling;

  if (val === '') {
    showInputError(input, errorEl, '请输入用户名');
    return false;
  } else if (val.length < 3) {
    showInputError(input, errorEl, '用户名至少3个字符');
    return false;
  } else if (val.length > 20) {
    showInputError(input, errorEl, '用户名不能超过20个字符');
    return false;
  } else {
    showInputSuccess(input, errorEl);
    return true;
  }
}

function validatePassword(input) {
  var val = input.value;
  var errorEl = input.nextElementSibling;

  if (val === '') {
    showInputError(input, errorEl, '请输入密码');
    return false;
  } else if (val.length < 6) {
    showInputError(input, errorEl, '密码至少6个字符');
    return false;
  } else {
    showInputSuccess(input, errorEl);
    return true;
  }
}

function initRegisterForm() {
  var form = document.getElementById('register-form');
  if (!form) return;

  var username = document.getElementById('reg-username');
  var password = document.getElementById('reg-password');
  var confirmPwd = document.getElementById('reg-confirm');

  var inputs = [username, password, confirmPwd];
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('blur', function () {
      switch (this.id) {
        case 'reg-username': validateRegUsername(); break;
        case 'reg-password': validateRegPassword(); break;
        case 'reg-confirm': validateConfirmPwd(); break;
      }
    });
    inputs[i].addEventListener('input', function () {
      clearError(this);
      if (this.id === 'reg-password') updatePasswordStrength();
    });
  }

  password.addEventListener('input', function () {
    updatePasswordStrength();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var allValid = true;
    if (!validateRegUsername()) allValid = false;
    if (!validateRegPassword()) allValid = false;
    if (!validateConfirmPwd()) allValid = false;

    if (allValid) {
      var users = JSON.parse(localStorage.getItem('zhiyuan_users') || '[]');

      var exists = false;
      for (var k = 0; k < users.length; k++) {
        if (users[k].username === username.value) {
          exists = true;
          break;
        }
      }

      if (exists) {
        showToast('该用户名已被注册，请换一个试试！', 'error');
        return;
      }

      users.push({
        username: username.value,
        password: password.value,
        regTime: new Date().toLocaleString()
      });
      localStorage.setItem('zhiyuan_users', JSON.stringify(users));

      showToast('注册成功！3秒后跳转到登录页...', 'success');
      setTimeout(function () {
        window.location.href = 'login.html';
      }, 3000);
    }
  });
}

function validateRegUsername() {
  var input = document.getElementById('reg-username');
  if (!input) return false;
  var val = input.value.trim();
  var errorEl = input.nextElementSibling;

  if (val === '') {
    showInputError(input, errorEl, '请输入用户名');
    return false;
  } else if (val.length < 3) {
    showInputError(input, errorEl, '用户名至少3个字符');
    return false;
  } else if (!/^[a-zA-Z0-9_一-龥]+$/.test(val)) {
    showInputError(input, errorEl, '用户名只能包含中英文、数字和下划线');
    return false;
  } else {
    showInputSuccess(input, errorEl);
    return true;
  }
}

function validateRegPassword() {
  var input = document.getElementById('reg-password');
  if (!input) return false;
  var val = input.value;
  var errorEl = input.nextElementSibling;

  if (val === '') {
    showInputError(input, errorEl, '请输入密码');
    return false;
  } else if (val.length < 6) {
    showInputError(input, errorEl, '密码至少6个字符');
    return false;
  } else if (val.length > 20) {
    showInputError(input, errorEl, '密码不能超过20个字符');
    return false;
  } else {
    showInputSuccess(input, errorEl);
    return true;
  }
}

function validateConfirmPwd() {
  var password = document.getElementById('reg-password');
  var confirm = document.getElementById('reg-confirm');
  if (!confirm) return false;
  var errorEl = confirm.nextElementSibling;

  if (confirm.value === '') {
    showInputError(confirm, errorEl, '请再次输入密码确认');
    return false;
  } else if (confirm.value !== password.value) {
    showInputError(confirm, errorEl, '两次输入的密码不一致');
    return false;
  } else {
    showInputSuccess(confirm, errorEl);
    return true;
  }
}

function updatePasswordStrength() {
  var password = document.getElementById('reg-password');
  var bar = document.getElementById('password-strength');
  if (!password || !bar) return;

  var val = password.value;
  var strength = 0;

  var checks = [
    val.length >= 6,
    val.length >= 10,
    /[a-z]/.test(val),
    /[A-Z]/.test(val),
    /\d/.test(val),
    /[^a-zA-Z0-9]/.test(val)
  ];

  checks.forEach(function (check) {
    if (check) strength++;
  });

  var text, color;
  switch (true) {
    case (strength <= 1):
      text = '弱'; color = '#e74c3c'; break;
    case (strength <= 3):
      text = '中'; color = '#f39c12'; break;
    case (strength <= 5):
      text = '强'; color = '#27ae60'; break;
    default:
      text = '极强'; color = '#2980b9'; break;
  }

  bar.textContent = '密码强度：' + text;
  bar.style.color = color;
}

function showInputError(input, errorEl, msg) {
  input.classList.add('error');
  input.classList.remove('success');
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.add('show');
  }
}

function showInputSuccess(input, errorEl) {
  input.classList.remove('error');
  input.classList.add('success');
  if (errorEl) {
    errorEl.classList.remove('show');
  }
}

function clearError(input) {
  input.classList.remove('error', 'success');
  var errorEl = input.nextElementSibling;
  if (errorEl) {
    errorEl.classList.remove('show');
  }
}
