<template>
  <div class="h-screen flex flex-col relative">
    <!-- Chat Header -->
    <div
      class="bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/60 p-4 fixed top-[65px] left-0 right-0 z-10"
    >
      <div class="flex items-center gap-3">
        <button
          @click="router.back()"
          class="text-white hover:text-neonCyan transition-colors p-1"
        >
          <PhCaretLeft :size="24" weight="bold" />
        </button>
        <div
          class="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20"
        >
          <img
            v-if="
              otherProfile?.photos?.[0] &&
              (otherProfile.photos[0].startsWith('data:') ||
                otherProfile.photos[0].startsWith('http'))
            "
            :src="otherProfile.photos[0]"
            :alt="otherProfile.displayName"
            class="w-full h-full object-cover"
          />
          <div
            v-else-if="
              otherProfile?.photos?.[0] &&
              !otherProfile.photos[0].startsWith('data:') &&
              !otherProfile.photos[0].startsWith('http')
            "
            class="w-full h-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center text-lg font-bold text-white"
          >
            {{ otherProfile.photos[0] }}
          </div>
          <div
            v-else
            class="w-full h-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center text-white font-bold text-lg"
          >
            {{ otherProfile?.displayName?.charAt(0) || "?" }}
          </div>
        </div>
        <div class="flex-1">
          <h2 class="font-semibold text-white text-lg">
            {{ otherProfile?.displayName || "กำลังโหลด..." }}
          </h2>
          <p class="text-sm text-slate-400 flex items-center gap-1">
            <PhMapPin :size="14" weight="fill" /> {{ otherProfile?.zone || "ไม่ทราบโซน" }}
          </p>
        </div>
        <button @click="showMenuModal = true" class="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <PhDotsThreeVertical :size="24" class="text-slate-400" weight="bold" />
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-3 pt-20 pb-[280px]"
    >
      <template v-for="(message, index) in messages" :key="message.id">
        <!-- Date Separator -->
        <div v-if="shouldShowDateSeparator(message, index)" class="flex justify-center my-4">
          <div class="px-4 py-1.5 bg-slate-800/60 backdrop-blur-sm rounded-full text-xs text-slate-300 border border-slate-700/50">
            {{ formatDate(message.createdAt) }}
          </div>
        </div>
        
        <!-- Message -->
        <div
          class="flex group"
          :class="
            message.senderId === currentUser?.uid
              ? 'justify-end'
              : 'justify-start'
          "
          @contextmenu.prevent="openMessageMenu(message, $event)"
        >
          <div
            class="max-w-[75%] px-4 py-3 rounded-2xl shadow-lg relative"
            :class="
              message.senderId === currentUser?.uid
                ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white'
                : 'bg-slate-700/90 text-white border border-slate-600/50'
            "
          >
            <!-- Reply Preview -->
            <div v-if="message.replyTo" class="mb-2 pb-2 border-b border-white/20">
              <p class="text-xs opacity-70">ตอบกลับ</p>
              <p class="text-sm opacity-90 truncate">{{ message.replyTo.text }}</p>
            </div>
            
            <!-- Image -->
            <img v-if="message.imageUrl" :src="message.imageUrl" class="rounded-lg mb-2 max-w-full" @click="viewImage(message.imageUrl)" />
            
            <!-- Text -->
            <p v-if="message.text" class="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{{ message.text }}</p>
            
            <!-- Time & Status -->
            <div class="flex items-center gap-1 mt-1.5">
              <p class="text-[11px]"
                 :class="message.senderId === currentUser?.uid ? 'text-white/80' : 'text-slate-300'"
              >
                {{ formatTime(message.createdAt) }}
              </p>
              <span v-if="message.senderId === currentUser?.uid" class="text-[11px]">
                <PhCheck v-if="isRead(message)" :size="14" weight="bold" class="text-neonCyan" />
                <PhCheck v-else-if="message.status === 'sent'" :size="14" weight="bold" class="text-white/60" />
              </span>
            </div>
            
            <!-- Reply Button (on hover) -->
            <button 
              @click="setReplyTo(message)"
              class="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-slate-800 rounded-full"
            >
              <PhArrowLeft :size="16" class="text-slate-300" weight="bold" />
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Input -->
    <div
      class="bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/60 p-4 fixed bottom-[70px] left-0 right-0 z-10 max-w-screen"
    >
      <!-- Reply Preview -->
      <div v-if="replyingTo" class="mb-2 p-2 bg-slate-800/60 rounded-lg flex items-center justify-between">
        <div class="flex-1 min-w-0">
          <p class="text-xs text-slate-400">ตอบกลับ</p>
          <p class="text-sm truncate">{{ replyingTo.text }}</p>
        </div>
        <button @click="cancelReply" class="p-1">
          <PhX :size="16" class="text-slate-400" weight="bold" />
        </button>
      </div>
      
      <div class="mb-2">
        <IcebreakerButton @select="insertQuestion" />
      </div>
      
      <form @submit.prevent="sendMsg" class="flex gap-2 items-end">
        <!-- Image Upload -->
        <button type="button" @click="imageInput?.click()" class="p-3 bg-slate-800/60 rounded-xl hover:bg-slate-700/60 transition-colors">
          <PhCamera :size="20" class="text-slate-300" weight="fill" />
        </button>
        <input ref="imageInput" type="file" accept="image/*" @change="handleImageUpload" class="hidden" />
        
        <!-- Emoji Picker -->
        <button type="button" @click="showEmojiPicker = !showEmojiPicker" class="p-3 bg-slate-800/60 rounded-xl hover:bg-slate-700/60 transition-colors">
          <PhSmiley :size="20" class="text-slate-300" weight="fill" />
        </button>
        
        <input
          v-model="newMessage"
          type="text"
          placeholder="พิมพ์ข้อความ..."
          class="flex-1 min-w-0 px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-neonCyan focus:ring-1 focus:ring-neonCyan/50 transition-all"
          maxlength="500"
        />
        <button
          type="submit"
          :disabled="!newMessage.trim() && !uploadedImage"
          class="px-6 py-3 bg-gradient-to-r from-neonPink to-neonCyan rounded-xl font-semibold text-white shadow-lg disabled:opacity-50 disabled:shadow-none hover:shadow-xl transition-all"
        >
          <PhPaperPlaneRight :size="20" weight="fill" />
        </button>
      </form>
      
      <!-- Emoji Picker Popup -->
      <div v-if="showEmojiPicker" class="absolute bottom-full left-0 right-0 mx-4 mb-2 bg-slate-800 rounded-xl p-4 border border-slate-700 max-h-48 overflow-y-auto">
        <div class="grid grid-cols-8 gap-2">
          <button v-for="emoji in emojis" :key="emoji" @click="insertEmoji(emoji)" class="text-2xl hover:bg-slate-700 rounded p-1">
            {{ emoji }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Menu Modal -->
    <Teleport to="body">
      <div v-if="showMenuModal" @click="showMenuModal = false" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end justify-center z-[100] p-4">
        <div @click.stop class="bg-slate-900 rounded-t-3xl w-full max-w-md p-6 space-y-3 animate-slide-up">
          <button 
            @click="showMenuModal = false; showBlockModal = true"
            class="w-full py-4 bg-red-500/20 border border-red-500 rounded-xl font-semibold text-red-400 hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
          >
            <PhProhibit :size="20" weight="bold" />
            บล็อกผู้ใช้
          </button>
          <button 
            @click="showMenuModal = false"
            class="w-full py-4 bg-slate-800 rounded-xl font-semibold text-slate-300 hover:bg-slate-700 transition-all"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Block Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showBlockModal" @click="showBlockModal = false" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
        <div @click.stop class="bg-slate-900 rounded-xl border border-slate-700 p-6 max-w-sm w-full space-y-4">
          <h3 class="text-xl font-bold">บล็อกผู้ใช้</h3>
          <p class="text-slate-400">คุณต้องการบล็อก {{ otherProfile?.displayName }} หรือไม่?</p>
          <div class="flex gap-3">
            <button @click="showBlockModal = false" class="flex-1 py-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors">
              ยกเลิก
            </button>
            <button @click="blockUser" class="flex-1 py-3 bg-red-500 rounded-xl hover:bg-red-600 transition-colors">
              บล็อก
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- Image Viewer -->
    <Teleport to="body">
      <div v-if="viewingImage" @click="viewingImage = null" class="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-6">
        <img :src="viewingImage" class="max-w-full max-h-full rounded-lg" />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc } from "firebase/firestore";
import type { Message, Profile } from "~/types";
import IcebreakerButton from "@/components/IcebreakerButton.vue";

const route = useRoute();
const router = useRouter();
const { subscribeToMessages, sendMessage, markAsRead } = useChats();
const { blockUser: blockUserAction } = useSafety();
const { uploadChatImage } = useStorage();
const { currentUser } = useAuth();
const { db } = useFirebase();

const chatId = route.params.chatId as string;
const messages = ref<Message[]>([]);
const newMessage = ref("");
const otherProfile = ref<Profile | null>(null);
const messagesContainer = ref<HTMLElement>();
const replyingTo = ref<Message | null>(null);
const showEmojiPicker = ref(false);
const showBlockModal = ref(false);
const showMenuModal = ref(false);
const imageInput = ref<HTMLInputElement>();
const uploadedImage = ref<string | null>(null);
const viewingImage = ref<string | null>(null);

const emojis = ['😀', '😂', '😍', '🥰', '😘', '😊', '😎', '🤩', '🥳', '😏', '😜', '🤪', '😇', '🤗', '🤔', '😳', '🥺', '😢', '😭', '😤', '😡', '🤬', '😱', '😨', '🤯', '😴', '🤤', '😋', '🤑', '🤠', '👍', '👎', '👏', '🙌', '🤝', '💪', '🙏', '❤️', '💕', '💖', '💗', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '💯', '💢', '💥', '💫', '💦', '💨', '🔥', '✨', '⭐', '🌟', '💫', '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🍻', '🍺', '🍷', '🍸', '🍹', '🍾', '🥂'];

let unsubscribe: (() => void) | null = null;

onMounted(async () => {
  // Mark chat as read
  try {
    const { doc: docRef, updateDoc } = await import('firebase/firestore')
    const chatRef = docRef(db, 'chats', chatId)
    await updateDoc(chatRef, {
      [`unreadCount_${currentUser.value?.uid}`]: 0
    })
  } catch (error) {
    console.error('Error marking as read:', error)
  }
  
  // Subscribe to messages
  unsubscribe = subscribeToMessages(chatId, (newMessages) => {
    messages.value = newMessages;
    
    // Mark unread messages as read
    const unreadMessages = newMessages.filter(m => 
      m.senderId !== currentUser.value?.uid && 
      (!m.readBy || !m.readBy.includes(currentUser.value?.uid || ''))
    );
    if (unreadMessages.length > 0) {
      markAsRead(chatId, unreadMessages.map(m => m.id));
    }
  });
  
  // Initial scroll to bottom
  setTimeout(() => scrollToBottom(), 100);

  // Get chat info to find other user
  const chatDoc = await getDoc(doc(db, "chats", chatId));
  if (chatDoc.exists()) {
    const chatData = chatDoc.data();
    const otherUserId = chatData.userIds.find(
      (id: string) => id !== currentUser.value?.uid
    );

    if (otherUserId) {
      const profileDoc = await getDoc(doc(db, "profiles", otherUserId));
      if (profileDoc.exists()) {
        otherProfile.value = {
          id: profileDoc.id,
          ...profileDoc.data(),
        } as Profile;
      }
    }
  }
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const sendMsg = async () => {
  if (!newMessage.value.trim() && !uploadedImage.value) return;

  const options: any = {};
  if (uploadedImage.value) options.imageUrl = uploadedImage.value;
  if (replyingTo.value) {
    options.replyTo = {
      messageId: replyingTo.value.id,
      text: replyingTo.value.text,
      senderId: replyingTo.value.senderId
    };
  }

  await sendMessage(chatId, newMessage.value, options);
  newMessage.value = "";
  uploadedImage.value = null;
  replyingTo.value = null;
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth'
    });
  }
};

const formatTime = (timestamp: any) => {
  if (!timestamp) return '';
  const date = timestamp instanceof Date ? timestamp : (timestamp.toDate ? timestamp.toDate() : new Date(timestamp));
  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (timestamp: any) => {
  if (!timestamp) return '';
  const date = timestamp instanceof Date ? timestamp : (timestamp.toDate ? timestamp.toDate() : new Date(timestamp));
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (isSameDay(date, today)) return 'วันนี้';
  if (isSameDay(date, yesterday)) return 'เมื่อวาน';
  
  return date.toLocaleDateString('th-TH', { 
    day: 'numeric', 
    month: 'long',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
};

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const shouldShowDateSeparator = (message: Message, index: number) => {
  if (index === 0) return true;
  if (!message.createdAt) return false;
  const currentDate = message.createdAt instanceof Date ? message.createdAt : (message.createdAt.toDate ? message.createdAt.toDate() : new Date(message.createdAt));
  const prevMessage = messages.value[index - 1];
  if (!prevMessage?.createdAt) return false;
  const prevDate = prevMessage.createdAt instanceof Date ? prevMessage.createdAt : (prevMessage.createdAt.toDate ? prevMessage.createdAt.toDate() : new Date(prevMessage.createdAt));
  return !isSameDay(currentDate, prevDate);
};

const insertQuestion = (question: string) => {
  newMessage.value = question;
};

const setReplyTo = (message: Message) => {
  replyingTo.value = message;
};

const cancelReply = () => {
  replyingTo.value = null;
};

const insertEmoji = (emoji: string) => {
  newMessage.value += emoji;
  showEmojiPicker.value = false;
};

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Upload to Firebase Storage
    const downloadURL = await uploadChatImage(file, chatId);
    uploadedImage.value = downloadURL;
  } catch (error) {
    console.error('Image upload error:', error);
    alert('อัพโหลดรูปไม่สำเร็จ');
  }
};

const viewImage = (url: string) => {
  viewingImage.value = url;
};

const isRead = (message: Message) => {
  if (!message.readBy) return false;
  return message.readBy.length > 1; // More than just sender
};

const blockUser = async () => {
  if (!otherProfile.value) return;
  await blockUserAction(otherProfile.value.userId);
  showBlockModal.value = false;
  router.push('/chats');
};

const openMessageMenu = (message: Message, event: MouseEvent) => {
  // Future: Add context menu for copy, delete, etc.
};

// Watch messages and auto-scroll
watch(() => messages.value.length, () => {
  nextTick(() => {
    setTimeout(() => scrollToBottom(), 50);
  });
}, { flush: 'post' });

defineExpose({ shouldShowDateSeparator, formatDate });
</script>
