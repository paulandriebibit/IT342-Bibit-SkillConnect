package edu.cit.bibit.skillconnect.features.messages;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Long> {
    
    @Query("SELECT m FROM Message m WHERE (m.senderId = :u1 AND m.receiverId = :u2) OR (m.senderId = :u2 AND m.receiverId = :u1) ORDER BY m.timestamp ASC")
    List<Message> findChatHistory(@Param("u1") Long user1, @Param("u2") Long user2);

    @Query("SELECT DISTINCT m.receiverId, m.receiverName FROM Message m WHERE m.senderId = :userId UNION SELECT DISTINCT m.senderId, m.senderName FROM Message m WHERE m.receiverId = :userId")
    List<Object[]> findActiveChatPartners(@Param("userId") Long userId);
}