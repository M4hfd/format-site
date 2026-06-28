document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    if (validateForm()) showSuccess();
  });

  function validateForm() {
    let ok = true;
    const name = v('name'), email = v('email'), phone = v('phone'), msg = v('message');
    if (name.length < 2)          { err('name',    'Введите имя (не менее 2 символов)'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err('email', 'Введите корректный e-mail'); ok = false; }
    if (phone && !/^[\+7|8][\d\-\s\(\)]{9,14}$/.test(phone)) { err('phone', 'Введите корректный номер'); ok = false; }
    if (msg.length < 10)          { err('message', 'Сообщение слишком короткое'); ok = false; }
    return ok;
  }

  function v(id) { return document.getElementById(id).value.trim(); }

  function err(id, text) {
    const el = document.getElementById(id);
    el.classList.add('error');
    const span = el.parentNode.querySelector('.form__error');
    if (span) { span.textContent = text; span.classList.add('visible'); }
  }

  function clearErrors() {
    form.querySelectorAll('.form__input, .form__textarea').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.form__error').forEach(el => { el.textContent = ''; el.classList.remove('visible'); });
  }

  function showSuccess() {
    form.style.display = 'none';
    document.getElementById('form-success').classList.add('visible');
  }
});
