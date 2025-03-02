const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate-pdf', (req, res) => {
    const { student, group, teacher, level, grades, comments } = req.body;

    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    res.setHeader('Content-Disposition', `attachment; filename="${student || 'Student'}_Report.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // Додаємо локальний логотип (справа, зверху)
    const pageWidth = doc.page.width; // Ширина сторінки A4 (595pt за замовчуванням)
    doc.image(path.join(__dirname, 'school-logo.png'), pageWidth - 150, 50, { // Зсунуто праворуч
        width: 100,
        align: 'right'
    });

    // Заголовок "Teacher Report" по центру, нижче логотипу
    doc.fontSize(24).fillColor('#2c3e50').text('Teacher Report', {
        align: 'center',
        x: 50,
        y: 120 // Зменшено, щоб текст був нижче логотипу, але не надто далеко
    });
    doc.moveDown(2);

    // Інформація про студента (зсунуто вниз, щоб уникнути перетину з логотипом)
    doc.fontSize(14).fillColor('#34495e').text('Student Information', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#7f8c8d').text(`Student: ${student}`, 50, null, { width: 495 });
    doc.text(`Group: ${group}`, 50, null, { width: 495 });
    doc.text(`Teacher: ${teacher}`, 50, null, { width: 495 });
    doc.text(`English Level: ${level}`, 50, null, { width: 495 });
    doc.moveDown(1.5);

    // Оцінки
    doc.fontSize(14).fillColor('#34495e').text('Grades', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#7f8c8d').text(`Grammar: ${grades.Grammar}/100`, 50, null, { width: 495 });
    doc.text(`Vocabulary: ${grades.Vocabulary}/100`, 50, null, { width: 495 });
    doc.text(`Reading: ${grades.Reading}/100`, 50, null, { width: 495 });
    doc.text(`Writing: ${grades.Writing}/100`, 50, null, { width: 495 });
    doc.text(`Speaking: ${grades.Speaking}/100`, 50, null, { width: 495 });
    doc.text(`Listening: ${grades.Listening}/100`, 50, null, { width: 495 });
    doc.moveDown(1.5);

    // Коментарі
    doc.fontSize(14).fillColor('#34495e').text('Teacher\'s Comments', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#2c3e50').text(comments, 50, null, {
        align: 'left',
        width: 495,
        continued: false
    });

    doc.end();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
