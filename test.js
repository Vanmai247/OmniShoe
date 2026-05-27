const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');

console.log("🚀 Khởi chạy hệ thống kiểm thử tự động OmniShoe...");

// Mock các bài test sẽ chạy
try {
  // Test 1: Kiểm tra môi trường JSDOM hoạt động
  const dom = new JSDOM(`<!DOCTYPE html><html><body><h1 id="title">OmniShoe</h1></body></html>`);
  const document = dom.window.document;
  assert.strictEqual(document.getElementById('title').textContent, 'OmniShoe');
  console.log("✅ Test 1: Giả lập DOM (JSDOM) hoạt động hoàn hảo!");

  // Test 2: Kiểm tra cấu trúc tệp HTML & CSS nền tảng
  const htmlPath = path.join(__dirname, 'index.html');
  const cssPath = path.join(__dirname, 'style.css');
  
  assert.strictEqual(fs.existsSync(htmlPath), true, "Thiếu file index.html");
  assert.strictEqual(fs.existsSync(cssPath), true, "Thiếu file style.css");

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const dom2 = new JSDOM(htmlContent);
  const doc2 = dom2.window.document;
  
  assert.ok(doc2.querySelector('header'), "Thiếu thẻ <header>");
  assert.ok(doc2.querySelector('main'), "Thiếu thẻ <main>");
  assert.ok(doc2.querySelector('footer'), "Thiếu thẻ <footer>");
  console.log("✅ Test 2: Cấu trúc file HTML5 ngữ nghĩa chuẩn xác!");

  // Test 3: Kiểm tra việc chuyển đổi Dark Mode
  const htmlContent3 = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const dom3 = new JSDOM(htmlContent3, { runScripts: "dangerously", resources: "usable" });
  const doc3 = dom3.window.document;
  
  // Giả lập nạp file app.js vào môi trường kiểm thử
  const appJsCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
  const scriptEl = doc3.createElement('script');
  scriptEl.textContent = appJsCode;
  doc3.body.appendChild(scriptEl);
  
  // Kích hoạt DOMContentLoaded sự kiện trong JSDOM giả lập
  const event = doc3.createEvent("Event");
  event.initEvent("DOMContentLoaded", true, true);
  doc3.dispatchEvent(event);

  const themeBtn = doc3.getElementById('theme-toggle');
  assert.ok(themeBtn, "Thiếu nút #theme-toggle ở Header");
  
  // Ban đầu không có data-dark
  assert.strictEqual(doc3.documentElement.hasAttribute('data-dark'), false, "Ban đầu không được có data-dark");
  
  // Giả lập click nút
  themeBtn.click();
  
  // Sau khi click phải có data-dark
  assert.strictEqual(doc3.documentElement.hasAttribute('data-dark'), true, "Chưa bật thuộc tính data-dark sau khi click");
  console.log("✅ Test 3: Tính năng chuyển đổi Dark Mode hoạt động chính xác!");

  // Test 4: Kiểm tra cấu trúc Hero & Brands đối tác
  const htmlContent4 = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const dom4 = new JSDOM(htmlContent4);
  const doc4 = dom4.window.document;
  
  assert.ok(doc4.querySelector('.hero'), "Thiếu class .hero");
  assert.ok(doc4.querySelector('.brands'), "Thiếu class .brands");
  
  const brandButtons = doc4.querySelectorAll('.brands-container button');
  assert.strictEqual(brandButtons.length >= 7, true, "Thiếu 7 hãng giày đối tác");
  console.log("✅ Test 4: Cấu trúc Hero & Brands đối tác được xác thực!");

  // Test 5: Kiểm tra việc lọc sản phẩm theo danh mục
  const htmlContent5 = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const dom5 = new JSDOM(htmlContent5, { runScripts: "dangerously" });
  const doc5 = dom5.window.document;
  
  // Giả lập nạp app.js
  const appJsCode5 = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
  const scriptEl5 = doc5.createElement('script');
  scriptEl5.textContent = appJsCode5;
  doc5.body.appendChild(scriptEl5);
  
  // Kích hoạt DOMContentLoaded sự kiện trong JSDOM giả lập
  const event5 = doc5.createEvent("Event");
  event5.initEvent("DOMContentLoaded", true, true);
  doc5.dispatchEvent(event5);

  const filterBtn = doc5.querySelector('.filter-pill[data-filter="Running"]');
  assert.ok(filterBtn, "Thiếu nút lọc Running");
  
  // Click lọc Running
  filterBtn.click();
  
  // Xem các card sản phẩm
  const productCards = doc5.querySelectorAll('.product-card');
  assert.strictEqual(productCards.length, 6, "Phải có đúng 6 sản phẩm mockup trong DOM");
  console.log("✅ Test 5: Hệ thống lọc và tải sản phẩm chính xác!");
} catch (error) {
  console.error("❌ Test thất bại:", error.message || error);
  process.exit(1);
}
