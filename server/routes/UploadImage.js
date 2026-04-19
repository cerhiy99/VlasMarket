const router = require('express')();
const uuid = require('uuid');
const path = require('path');
const sharp = require('sharp');

router.post('/', async (req, res) => {
  try {
    if (!req.files?.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const img = req.files.file;

    const imageName = uuid.v4() + '.webp';
    const imagePath = path.resolve(__dirname, '..', 'static', imageName);

    // 🔥 Конвертація у webp
    await sharp(img.data)
      .webp({ quality: 85 }) // можна змінювати якість
      .toFile(imagePath);

    //const fileUrl = `${process.env.BECK_URL_IMG}${imageName}`;
    const fileUrl = `/image/${imageName}`;

    res.json({
      success: true,
      data: {
        files: [
          {
            url: fileUrl,
            name: imageName,
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error during upload.',
    });
  }
});

module.exports = router;
