import React from 'react';

const Pet = ({ name, message, mood = 'happy' }) => {
  // Different messages based on mood could be implemented later

  return (
    <div className="flex flex-col items-center">
      {/* Speech bubble */}
      <div className="relative mb-4">
        <div className="bg-white p-3 rounded-lg shadow-md relative">
          <p className="text-gray-700 text-center">{message}</p>
          {/* Triangle pointer for the speech bubble */}
          <div className="absolute h-4 w-4 bg-white rotate-45 -bottom-2 left-1/2 -translate-x-1/2"></div>
        </div>
      </div>

      {/* Pet image and info */}
      <div
        className="w-64 flex flex-col items-center rounded-lg shadow p-4"
        style={{ backgroundColor: '#FDF1DD' }}
      >
        <h2 className="text-xl font-semibold mb-2">{name}</h2>
        <img
          src="/gaugau.png"
          alt="Pet"
          className="w-40 h-40 object-cover mb-4"
        />
        <p className="text-gray-500 text-center">Trạng thái: {mood === 'happy' ? 'Vui vẻ 😄' : mood === 'sad' ? 'Buồn 😢' : mood === 'angry' ? 'Giận 😠' : mood === 'sleeping' ? 'Ngủ 😴' : 'Bình thường 🙂'}</p>
      </div>
    </div>
  );
};

export default Pet;
