import { ReactNode } from 'react'

function NoResultsImage() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="121"
      height="120"
      viewBox="0 0 121 120"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.9185 111.111C28.6743 111.111 29.4316 111.49 29.9505 111.997C30.4557 112.518 30.7077 113.292 30.7077 114.066C30.7077 114.826 30.4557 115.599 29.9505 116.12C29.4316 116.627 28.6743 116.88 27.9185 116.88C27.1613 116.88 26.4043 116.627 25.8851 116.12C25.3799 115.599 25.1279 114.826 25.1279 114.066C25.1279 113.292 25.3799 112.518 25.8851 111.997C26.4043 111.49 27.1615 111.111 27.9185 111.111ZM27.9185 113.292C27.6935 113.292 27.569 113.392 27.4555 113.503L27.4133 113.545C27.2872 113.671 27.1615 113.798 27.1615 114.066C27.1615 114.192 27.2874 114.445 27.4133 114.573C27.5254 114.685 27.6373 114.698 27.8387 114.699L27.9185 114.699C28.0446 114.699 28.2967 114.699 28.4223 114.573C28.5325 114.461 28.5462 114.253 28.548 114.119L28.5482 114.066C28.5482 113.798 28.5482 113.671 28.4223 113.545C28.2964 113.419 28.0444 113.292 27.9185 113.292ZM77.4838 18.9751C83.9479 23.0838 89.0088 29.6422 90.9165 37.8604C92.8226 45.9523 91.2944 54.1857 87.2428 60.8704C83.3168 67.4138 76.7268 72.551 68.7341 74.4925C62.1725 76.0415 55.6109 75.3378 49.931 72.8326L44.0706 82.6547L45.1645 83.3444C45.6683 83.6126 45.7959 84.2448 45.5425 84.7656L34.1297 103.525C33.2465 105.186 31.5911 106.226 29.9505 106.607H29.8244C28.1703 106.987 26.4041 106.734 24.7484 105.834V105.706C23.108 104.679 22.0853 103.132 21.706 101.47C21.3281 99.7961 21.5798 97.8683 22.4632 96.3345L33.8774 77.5601C34.2553 77.0543 34.8864 76.9281 35.3904 77.1806L36.4984 77.8707L42.3451 68.061C37.6214 64.0798 34.1297 58.4916 32.6152 51.9898C30.5818 43.7716 32.0963 35.5531 36.163 28.995C40.2147 22.3105 46.679 17.3012 54.7976 15.2465C62.7752 13.3185 70.8936 14.8523 77.4838 18.9751ZM35.1387 79.6147L24.3707 97.4876C23.7394 98.5157 23.4876 99.7963 23.8655 100.949C24.1173 102.104 24.7484 103.272 25.8849 103.905C26.6833 104.44 27.4829 104.666 28.2827 104.666C28.6192 104.666 28.9699 104.623 29.3054 104.553H29.4313C30.5816 104.298 31.7181 103.525 32.363 102.372L43.1309 84.639L35.1387 79.6147ZM80.0071 89.9028C80.6521 89.9028 81.1571 90.4234 81.1571 90.9292C81.1571 91.5767 80.6519 92.0835 80.0071 92.0835H68.1025C67.4729 92.0835 66.9676 91.5764 66.9676 90.9292C66.9676 90.4234 67.4729 89.9028 68.1025 89.9028H80.0071ZM83.8206 86.948C84.3258 86.948 84.831 87.4677 84.831 88.1011C84.831 88.6217 84.3258 89.129 83.8206 89.129H78.1149C77.6097 89.129 77.1043 88.6217 77.1043 88.1011C77.1043 87.4674 77.6097 86.948 78.1149 86.948H83.8206ZM44.0008 69.3844L38.28 78.9965L42.2753 81.5287L44.0706 82.6547L42.2755 81.5292L48.025 71.9035C47.3513 71.538 46.6925 71.1571 46.0477 70.749C45.3468 70.3275 44.6593 69.8629 44.0008 69.3844ZM55.3014 17.4273C47.8141 19.229 41.7291 23.9856 38.0554 30.1492C34.2558 36.1865 32.8672 43.8977 34.6337 51.4839C35.5319 55.2687 37.1434 58.6743 39.2892 61.6167C41.4485 64.5576 44.1404 67.0343 47.183 68.9626C53.268 72.6773 60.7416 74.0983 68.2301 72.298C75.7022 70.4961 81.7887 65.8663 85.4612 59.7022C89.1347 53.5385 90.6643 45.9523 88.757 38.3813C86.9903 30.7964 82.4186 24.6326 76.3473 20.7765C70.2486 17.0466 62.7752 15.6256 55.3014 17.4273ZM61.7658 21.0294C68.2301 21.0294 74.1892 23.7313 78.3667 27.9683C82.6715 32.3302 85.3348 38.2411 85.3348 44.9256C85.3348 51.4839 82.6715 57.3946 78.3667 61.7568C74.1892 66.1342 68.2298 68.836 61.7658 68.836C55.1751 68.836 49.3421 66.1342 45.0387 61.7568C40.8458 57.3948 38.1813 51.4839 38.1813 44.9256C38.1813 38.2411 40.8458 32.3302 45.0387 27.9683C49.3421 23.7313 55.1751 21.0294 61.7658 21.0294ZM61.7658 23.2118C55.8064 23.2118 50.4786 25.6595 46.5515 29.5158C42.7516 33.4985 40.3406 38.8885 40.3406 44.9258C40.3406 50.8367 42.7516 56.3669 46.5515 60.2232C50.4786 64.2064 55.8064 66.6403 61.7658 66.6403C67.5987 66.6403 73.0389 64.2064 76.8523 60.2232C80.7782 56.3669 83.1907 50.8367 83.1907 44.9258C83.1907 38.8885 80.7782 33.4985 76.8523 29.5158C73.0389 25.6595 67.599 23.2118 61.7658 23.2118ZM63.925 30.923L64.5564 33.3581L65.4395 33.4982L66.1962 33.8775L68.1025 32.3302L71.5242 34.9057L70.7675 37.2132L71.2727 37.8604L71.7767 38.6356L74.1892 38.5078L75.4505 42.6185L73.432 44.0257L73.5579 44.9258L73.432 45.6996L75.4505 47.1068L74.1892 51.2298L71.7767 51.1035L71.2727 51.8635L70.7675 52.5109L71.5242 54.8196L68.1025 57.3951L66.1962 55.8463L65.3133 56.2406L64.5564 56.4935L63.925 58.8023H59.6062L58.9751 56.4935L58.0918 56.2406L57.3211 55.8463L55.4275 57.3951L52.0068 54.8196L52.764 52.5109L52.2588 51.8635L51.755 51.1035L49.3423 51.2298L48.0661 47.1068L49.9734 45.6996V44.0257L48.0661 42.6185L49.3423 38.5078L51.755 38.6356L52.2588 37.8604L52.764 37.2132L52.0068 34.9057L55.4275 32.3302L57.3211 33.8775L58.0918 33.4982L58.9751 33.3581L59.6062 30.923H63.925ZM17.6634 54.6916L18.308 56.7462L16.2749 57.3948L15.645 55.339L17.6634 54.6916ZM62.271 33.104H61.2603L60.6152 35.1586L59.9841 35.285C59.606 35.4265 59.1008 35.5529 58.7229 35.6794C58.3436 35.806 57.9657 35.9336 57.5726 36.0604L57.0672 36.3131L55.4271 35.0323L54.5298 35.6794L55.1748 37.7341L54.7969 38.1148C54.4039 38.5078 54.1519 38.762 53.8987 39.1413C53.7725 39.5357 53.5208 39.7887 53.2676 40.1692L53.0155 40.8166L50.8563 40.6902L50.6043 41.7167L52.2583 42.9976L52.1324 44.2922V45.573L52.2583 46.8539L50.6043 48.0069L50.8563 49.0351L53.0155 48.9085L53.2676 49.5557C53.521 49.9349 53.7728 50.2031 54.0248 50.5824C54.1521 50.9631 54.53 51.2298 54.7972 51.6103L55.1751 51.9896L54.53 54.0592L55.3009 54.6916L57.0672 53.412L57.5726 53.6649C57.9657 53.7912 58.3436 54.0592 58.7229 54.1857C59.2267 54.3123 59.6058 54.3123 59.9841 54.4384L60.6152 54.5648L61.2603 56.6194H62.271L62.9009 54.5648L63.532 54.4384C63.925 54.3121 64.3029 54.3121 64.682 54.1857C65.0602 54.0592 65.4395 53.7912 65.8174 53.6649L66.4487 53.412L68.1025 54.6916L68.9857 54.0592L68.2298 51.9896L68.7339 51.6103C68.9857 51.2296 69.2393 50.9629 69.4909 50.5824C69.7429 50.3297 69.9963 49.9349 70.1224 49.5557L70.515 48.9085L72.5335 49.0351L72.9128 48.0069L71.1452 46.8539L71.2725 45.573L71.3984 44.9256L71.2725 44.2922L71.1452 42.9976L72.913 41.7167L72.5337 40.6902L70.5152 40.8166L70.1227 40.1692C69.9965 39.915 69.7431 39.5357 69.4911 39.1413C69.2396 38.762 68.9859 38.5078 68.7341 38.1148L68.2301 37.7341L68.9859 35.6794L68.1028 35.0323L66.4489 36.3131L65.8176 36.0604C65.5656 35.9338 65.1863 35.806 64.8084 35.6794C64.3029 35.5531 63.9253 35.4267 63.532 35.285L62.9009 35.1586L62.271 33.104ZM15.126 53.412L15.645 55.339L13.6116 55.9722L12.9805 54.0594L15.126 53.412ZM104.707 47.5015C105.716 47.5015 106.613 47.8808 107.244 48.528L107.37 48.6543C108.001 49.303 108.38 50.2031 108.38 51.2298C108.38 52.2577 108.001 53.1581 107.244 53.7915V53.9181C106.613 54.5653 105.716 54.946 104.707 54.946C103.696 54.946 102.813 54.565 102.042 53.7915C101.411 53.1581 101.033 52.2577 101.033 51.2298C101.033 50.2031 101.411 49.3032 102.042 48.528H102.182C102.813 47.8808 103.696 47.5015 104.707 47.5015ZM19.1914 52.1314L19.6966 54.1857L17.6634 54.6916L17.1592 52.7648L19.1914 52.1314ZM16.5283 50.8367L17.1592 52.7648L15.126 53.412L14.4947 51.4839L16.5283 50.8367ZM61.7658 36.581C64.0509 36.581 66.0708 37.6077 67.4729 39.0149C68.9859 40.5625 69.8704 42.6183 69.8704 44.9258C69.8704 47.1068 68.9859 49.1614 67.4729 50.7104C66.0706 52.2577 64.0509 53.1581 61.7658 53.1581C59.4804 53.1581 57.447 52.2577 55.9325 50.7104C54.5302 49.1614 53.6471 47.1068 53.6471 44.9258C53.6471 42.6185 54.53 40.5625 55.9325 39.0149C57.4467 37.6077 59.4804 36.581 61.7658 36.581ZM104.707 49.6825C104.327 49.6825 103.95 49.8088 103.57 50.0618C103.318 50.4563 103.192 50.837 103.192 51.2298C103.192 51.6105 103.318 51.9898 103.57 52.2577C103.95 52.637 104.327 52.7648 104.707 52.7648C105.085 52.7648 105.464 52.637 105.716 52.2577C106.109 51.9896 106.235 51.6103 106.235 51.2298C106.235 50.8367 106.109 50.456 105.716 50.0618C105.464 49.8088 105.085 49.6825 104.707 49.6825ZM61.766 38.762C60.1119 38.762 58.5972 39.5357 57.4472 40.5625C56.4382 41.7169 55.8069 43.1241 55.8069 44.9258C55.8069 46.5997 56.4382 48.0072 57.4472 49.1614C58.5975 50.3297 60.1119 50.9631 61.766 50.9631C63.4063 50.9631 64.9347 50.3297 65.9435 49.1614C67.0938 48.0069 67.7249 46.5997 67.7249 44.9258C67.7249 43.2657 67.0938 41.7169 65.9435 40.5625C64.9345 39.536 63.4061 38.762 61.766 38.762ZM84.3258 11.7695L88.2518 13.9655C88.757 14.3447 88.8829 14.9919 88.6311 15.4992C88.505 15.6256 88.3779 15.7519 88.2518 15.8935L84.3258 18.201C83.8206 18.4537 83.1907 18.3274 82.9375 17.8218C82.5459 17.3009 82.7979 16.6537 83.3168 16.273L85.5887 14.9922L83.3168 13.5712C82.7981 13.3185 82.5459 12.6711 82.9375 12.164C83.1907 11.6432 83.8206 11.3902 84.3258 11.7695ZM37.8031 9.20927L38.3072 11.1371C38.4345 11.6429 38.1813 12.2901 37.5499 12.4167C37.0459 12.5445 36.4148 12.2901 36.2887 11.6429L35.7835 9.85646C35.6436 9.20903 35.9094 8.56184 36.5407 8.43549C37.0459 8.30748 37.6773 8.68819 37.8031 9.20927ZM35.6439 7.91442C35.7837 8.43526 35.3907 9.08268 34.8866 9.20903L32.9929 9.71467C32.363 9.85622 31.7181 9.58832 31.5911 8.94089C31.4649 8.43526 31.8443 7.78783 32.3632 7.65982L34.3814 7.15418C34.8866 7.02806 35.5177 7.28076 35.6439 7.91442ZM40.9719 6.38064C41.0978 7.02806 40.8458 7.66005 40.2144 7.78783L38.3072 8.30724C37.8034 8.43526 37.1723 8.05454 37.0459 7.5337C36.7927 6.88628 37.172 6.38064 37.8031 6.12627L39.7092 5.60543C40.2144 5.47908 40.8458 5.8598 40.9719 6.38064ZM36.4148 3.6774L36.793 5.60567C37.0462 6.12651 36.6668 6.76016 36.0357 6.88651C35.518 7.02806 34.8869 6.63381 34.7608 6.12651L34.2555 4.32483C34.1297 3.6774 34.5073 3.172 35.0128 2.90386C35.6439 2.77727 36.1628 3.17176 36.4148 3.6774Z"
        fill="#CCCCCC"
      />
    </svg>
  )
}

export function NoFilteredResults({
  actions,
  description,
  title,
}: {
  actions?: ReactNode
  description: string
  title: string
}) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex gap-sds-xxl">
        <div className="flex flex-col gap-sds-l">
          <p className="font-semibold text-sds-header-l leading-sds-header-l">
            {title}
          </p>

          <p className="text-sds-body-s leading-sds-body-s">{description}</p>

          <div className="flex items-center gap-sds-xxs">{actions}</div>
        </div>

        <NoResultsImage />
      </div>
    </div>
  )
}