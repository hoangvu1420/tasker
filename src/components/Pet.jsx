import React from 'react';

const Pet = ({ name, message, mood = 'happy' }) => {
  // Get the correct image based on mood
  const getPetImage = () => {
    switch(mood) {
      case 'happy':
        return '/pet_happy.gif';
      case 'sad':
        return '/pet_sad.gif';
      default:
        // Default to happy image for other moods until we have specific images
        return '/pet_normal.png';
    }
  };

  return (
    <div className="flex flex-col items-center">


      {/* Pet image and info */}
      <div
        className="w-64 flex flex-col items-center rounded-lg shadow p-4 flex-grow w-[350px]  bg-white"
      >
        <div
          className="w-full h-[450px] border-t border-gray-300 my-4 bg-[url('/pet_name_sign.png')] bg-no-repeat bg-center bg-cover flex justify-center items-center"
        >
          <span className="text-gray-700 text-2xl font-bold">Thú cưng của tôi</span>
          
        </div>

        <div className='flex-grow'></div>
        <div className="flex flex-col items-center py-16 border-t border-b border-gray-300 w-full max-w-[500px] mx-auto">
          {/* Speech bubble with max width and word wrapping */}
          <div className="relative mb-4 w-full max-w-[250px]">
            <div className="bg-white p-3 rounded-lg shadow-md relative">
              <p className="text-gray-700 text-center break-words">{message}</p>
              <div className="absolute h-4 w-4 bg-white rotate-45 -bottom-2 left-1/2 -translate-x-1/2"></div>
            </div>
          </div>

          <img
            src={getPetImage()}
            alt={`${name} is ${mood}`}
            className="w-40 h-40 object-cover mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">{name}</h2>
          <p className="text-gray-500 text-center">
            Trạng thái: {mood === 'happy' ? 'Vui vẻ 😄' : mood === 'sad' ? 'Buồn 😢' : mood === 'angry' ? 'Giận 😠' : mood === 'sleeping' ? 'Ngủ 😴' : 'Bình thường 🙂'}
          </p>
        </div>

        <div className='flex-grow'></div>
        
        <div className="w-full h-[450px] my-4"></div>
      </div>
    </div>
  );
};

export default Pet;
