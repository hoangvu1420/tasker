import React, { useState, useRef, useEffect } from 'react';

const Pet = ({ name, message, mood = 'happy' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(0);
  const statuses = ['Đang ăn', 'Đang ngủ', 'Đang chơi', 'Đang học', 'Đang nghỉ'];

  // Mảng boolean để lưu trạng thái checkbox cho từng công việc
  const [checkedStatuses, setCheckedStatuses] = useState(Array(statuses.length).fill(false));

  // State quản lý mood nội bộ, khởi tạo từ prop
  const [currentMood, setCurrentMood] = useState(mood);

  const containerRef = useRef(null);

  // Khi prop mood thay đổi, cập nhật currentMood
  useEffect(() => {
    setCurrentMood(mood);
  }, [mood]);

  // Nếu currentMood khác 'normal', sau 5s sẽ reset về 'normal'
  useEffect(() => {
    if (currentMood !== 'normal') {
      const timer = setTimeout(() => {
        setCurrentMood('normal');
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [currentMood]);
const moodsByIndex = ['happy', 'sad', 'angry', 'sleeping', 'normal'];

const handleCheckboxChange = (index) => {
  setCheckedStatuses(prev => {
    const newChecked = [...prev];
    newChecked[index] = !newChecked[index];

    // Cập nhật điểm
    const newScore = newChecked.filter(Boolean).length;
    setScore(newScore);

    // Cập nhật mood: nếu checkbox index này được check thì cập nhật mood tương ứng
    // Nếu không có checkbox nào được check thì về normal
    const checkedIndex = newChecked.findIndex(Boolean);
    if (checkedIndex !== -1) {
      setCurrentMood(moodsByIndex[checkedIndex]);
    } else {
      setCurrentMood('normal');
    }

    return newChecked;
  });
};


  const getPetImage = () => {
    switch (currentMood) {
      case 'happy':
        return '/pet_happy.gif';
      case 'sad':
        return '/pet_sad.gif';
      case 'angry':
        return '/pet_angry.gif';  // ví dụ thêm
      case 'sleeping':
        return '/pet_sleeping.gif'; // ví dụ thêm
      case 'normal':
      default:
        return '/pet_normal.png';
    }
  };

  // Xử lý click ngoài vùng chứa để đóng collapse
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-64 flex flex-col items-center rounded-lg shadow p-4 flex-grow w-[350px] bg-white relative">
        <div
          className="w-full h-[450px] border-t border-gray-300 my-4 bg-[url('/pet_name_sign.png')] bg-no-repeat bg-center bg-cover flex justify-center items-center"
        >
          <span className="text-gray-700 text-2xl font-bold">Thú cưng của tôi</span>
        </div>

        <div className="flex-grow"></div>

        <div className="w-full text-right mb-2 flex justify-end items-center gap-2">
          <img src="/coin_ic.png" alt="coin icon" className="w-5 h-5" />
          <span className="font-semibold text-gray-700">Điểm: {score}</span>
        </div>

        <div className="flex flex-col items-center py-16 border-t border-b border-gray-300 w-full max-w-[500px] mx-auto bg-ghostwhite">
          <div className="relative mb-4 w-full max-w-[250px]">
            <div className="bg-white p-3 rounded-lg shadow-md relative">
              <p className="text-gray-700 text-center break-words">{message}</p>
              <div className="absolute h-4 w-4 bg-white rotate-45 -bottom-2 left-1/2 -translate-x-1/2"></div>
            </div>
          </div>

          <img
            src={getPetImage()}
            alt={`${name} is ${currentMood}`}
            className="w-40 h-40 object-cover mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">{name}</h2>
          <p className="text-gray-500 text-center">
            Trạng thái: {
              currentMood === 'happy' ? 'Vui vẻ 😄' :
              currentMood === 'sad' ? 'Buồn 😢' :
              currentMood === 'angry' ? 'Giận 😠' :
              currentMood === 'sleeping' ? 'Ngủ 😴' :
              'Bình thường 🙂'
            }
          </p>
        </div>

        <div className="flex-grow"></div>

        <div className="w-full relative mt-4" ref={containerRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex justify-between items-center p-2 border border-gray-300 rounded-md bg-white cursor-pointer select-none z-20 relative"
          >
            <span className="font-semibold text-gray-700">Danh sách công việc</span>
            <svg
              className={`w-5 h-5 text-gray-600 transform transition-transform duration-300 ${
                isOpen ? 'rotate-0' : 'rotate-180'
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <div
            className={`absolute bottom-full left-0 right-0 bg-white border-x border-b border-gray-300 rounded-b-md shadow-lg overflow-y-auto transition-[max-height] duration-300 ease-in-out z-30
              ${isOpen ? 'max-h-[450px] mt-1' : 'max-h-0'}
            `}
            style={{ transitionProperty: 'max-height' }}
          >
            {statuses.map((status, idx) => (
              <div
                key={idx}
                className="p-4 border-b border-gray-200 last:border-b-0 flex justify-between items-center"
              >
                <p className="text-gray-700">{status}</p>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold">+1</span>
                  <input
                    type="checkbox"
                    className="ml-2"
                    checked={checkedStatuses[idx]}
                    onChange={() => handleCheckboxChange(idx)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pet;
