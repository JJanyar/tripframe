import './base.css';
import './landing.css';
import './blog.css';
import { mountThemeSwitch } from './theme.js';
import { mountLogos } from './logo.js';

mountLogos();
mountThemeSwitch(document.getElementById('theme-switch'));

const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });
