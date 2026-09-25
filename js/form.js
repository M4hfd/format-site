const form = document.getElementById('contact-form');
const success = document.getElementById('form-success');
const generalError = document.getElementById('form-general-error');
const ENDPOINT = '/api/send';

function setError(input, text) {
  const group = input.closest('.form__group');
  const box = group.querySelector('.form__error');
  box.textContent = text;
  box.style.display = 'block';
  box.style.color = '#d93025';
  if (input.type !== 'checkbox') input.style.borderColor = '#d93025';
}

function clearErrors() {
  form.querySelectorAll('.form__error').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
  form.querySelectorAll('.form__input, .form__textarea').forEach(el => {
    el.style.borderColor = '';
  });
}

function showGeneralError(text) {
  generalError.textContent = text;
  generalError.style.display = 'block';
  generalError.style.color = '#d93025';
}

// ошибка исчезает, как только человек начинает исправлять поле
form.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', () => {
    const box = el.closest('.form__group')?.querySelector('.form__error');
    if (box) { box.textContent = ''; box.style.display = 'none'; }
    if (el.type !== 'checkbox') el.style.borderColor = '';
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const message = form.message.value.trim();
  let valid = true;

  if (!name) {
    setError(form.name, 'Введите ваше имя');
    valid = false;
  }
  if (!email) {
    setError(form.email, 'Введите e-mail');
    valid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    setError(form.email, 'Введите корректный e-mail');
    valid = false;
  }
  if (!message) {
    setError(form.message, 'Напишите сообщение');
    valid = false;
  }
  if (!form.agree.checked) {
    setError(form.agree, 'Необходимо согласие на обработку персональных данных');
    valid = false;
  }
  if (!valid) return;

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Отправка…';

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, message, _honey: form._honey.value })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error('send failed');

    form.style.display = 'none';
    success.classList.add('visible');
    form.reset();
  } catch (err) {
    showGeneralError('Не удалось отправить заявку. Попробуйте позже или позвоните: +7 (921) 014-88-80');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Отправить заявку';
  }
});