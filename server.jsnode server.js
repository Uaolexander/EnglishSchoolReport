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

    doc.fontSize(20).text('Teacher Report', { align: 'center' });
    doc.moveDown(1);

    doc.fontSize(12).text(`Student: ${student}`, { align: 'left' });
    doc.text(`Group: ${group}`);
    doc.text(`Teacher: ${teacher}`);
    doc.text(`English Level: ${level}`);
    doc.moveDown(1);

    doc.fontSize(14).text('Grades:', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Grammar: ${grades.Grammar}/100`);
    doc.text(`Vocabulary: ${grades.Vocabulary}/100`);
    doc.text(`Reading: ${grades.Reading}/100`);
    doc.text(`Writing: ${grades.Writing}/100`);
    doc.text(`Speaking: ${grades.Speaking}/100`);
    doc.text(`Listening: ${grades.Listening}/100`);
    doc.moveDown(1);

    doc.fontSize(14).text('Teacher\'s Comments:', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(comments, {
        align: 'left',
        width: 460,
        continued: false
    });

    doc.end();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
