// خدمة Firestore لإدارة المحتوى عبر Firebase
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    getDocs,
    Timestamp
} from "firebase/firestore";
import { db } from '../firebase';
import { LegalContent } from '../types';

const POSTS_COLLECTION = "posts";
const SETTINGS_COLLECTION = "settings";

export const firestoreService = {
    /**
     * إضافة منشور جديد
     */
    addPost: async (post: Omit<LegalContent, 'id'>) => {
        try {
            const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
                ...post,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("Error adding post:", error);
            return { success: false, error };
        }
    },

    /**
     * تحديث منشور موجود
     */
    updatePost: async (postId: string, updates: Partial<LegalContent>) => {
        try {
            const postRef = doc(db, POSTS_COLLECTION, postId);
            await updateDoc(postRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error("Error updating post:", error);
            return { success: false, error };
        }
    },

    /**
     * حذف منشور
     */
    deletePost: async (postId: string) => {
        try {
            const postRef = doc(db, POSTS_COLLECTION, postId);
            await deleteDoc(postRef);
            return { success: true };
        } catch (error) {
            console.error("Error deleting post:", error);
            return { success: false, error };
        }
    },

    /**
     * الاستماع للتحديثات الحية للمنشورات
     * @param callback دالة يتم استدعاؤها عند كل تحديث
     * @returns دالة لإيقاف الاستماع
     */
    listenToPosts: (callback: (posts: LegalContent[]) => void) => {
        const q = query(
            collection(db, POSTS_COLLECTION),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const posts: LegalContent[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // تحويل Timestamp إلى string للعرض
                    date: data.createdAt instanceof Timestamp
                        ? data.createdAt.toDate().toLocaleDateString('ar-EG')
                        : data.date || new Date().toLocaleDateString('ar-EG')
                } as LegalContent;
            });
            callback(posts);
        }, (error) => {
            console.error("Error listening to posts:", error);
            callback([]);
        });

        return unsubscribe;
    },

    /**
     * جلب المنشورات مرة واحدة (بدون استماع مباشر)
     */
    getPosts: async (): Promise<LegalContent[]> => {
        try {
            const q = query(
                collection(db, POSTS_COLLECTION),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    date: data.createdAt instanceof Timestamp
                        ? data.createdAt.toDate().toLocaleDateString('ar-EG')
                        : data.date || new Date().toLocaleDateString('ar-EG')
                } as LegalContent;
            });
        } catch (error) {
            console.error("Error getting posts:", error);
            return [];
        }
    }
};
